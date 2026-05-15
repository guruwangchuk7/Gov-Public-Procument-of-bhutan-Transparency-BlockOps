import { expect } from "chai";
import { ethers } from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { AwardRegistry, BidRegistry, TenderRegistry, UserRegistry } from "../typechain-types";

describe("Procurement registries", function () {
  const Role = {
    None: 0,
    Admin: 1,
    Agency: 2,
    Supplier: 3,
    Auditor: 4,
  };

  let userRegistry: UserRegistry;
  let tenderRegistry: TenderRegistry;
  let bidRegistry: BidRegistry;
  let awardRegistry: AwardRegistry;

  async function deployFixture() {
    const [admin, agency, supplier, outsider] = await ethers.getSigners();

    const UserRegistryFactory = await ethers.getContractFactory("UserRegistry");
    userRegistry = (await UserRegistryFactory.deploy(admin.address)) as UserRegistry;
    await userRegistry.waitForDeployment();

    const TenderRegistryFactory = await ethers.getContractFactory("TenderRegistry");
    tenderRegistry = (await TenderRegistryFactory.deploy(
      await userRegistry.getAddress(),
      admin.address,
    )) as TenderRegistry;
    await tenderRegistry.waitForDeployment();

    const BidRegistryFactory = await ethers.getContractFactory("BidRegistry");
    bidRegistry = (await BidRegistryFactory.deploy(
      await userRegistry.getAddress(),
      await tenderRegistry.getAddress(),
      admin.address,
    )) as BidRegistry;
    await bidRegistry.waitForDeployment();

    const AwardRegistryFactory = await ethers.getContractFactory("AwardRegistry");
    awardRegistry = (await AwardRegistryFactory.deploy(
      await userRegistry.getAddress(),
      await tenderRegistry.getAddress(),
      await bidRegistry.getAddress(),
      admin.address,
    )) as AwardRegistry;
    await awardRegistry.waitForDeployment();

    await tenderRegistry.setAwardRegistry(await awardRegistry.getAddress());

    await userRegistry.registerUser(agency.address, ethers.id("agency-ndi"), Role.Agency);
    await userRegistry.registerUser(supplier.address, ethers.id("supplier-ndi"), Role.Supplier);

    return { admin, agency, supplier, outsider };
  }

  beforeEach(async () => {
    await deployFixture();
  });

  async function publishTender(ref = "BT-TENDER-TEST") {
    const [, agency] = await ethers.getSigners();
    const deadline = (await time.latest()) + 3600;
    const opening = deadline;

    await tenderRegistry
      .connect(agency)
      .publishTender(ref, ethers.id(`${ref}-doc`), `ipfs://${ref}-doc`, deadline, opening);

    return { agency, deadline, opening, tenderId: 1 };
  }

  it("registers users and enforces identity uniqueness", async function () {
    const [, , , outsider] = await ethers.getSigners();

    await expect(
      userRegistry.registerUser(outsider.address, ethers.id("supplier-ndi"), Role.Supplier),
    ).to.be.revertedWith("UserRegistry: identity already linked");

    expect(await userRegistry.hasUserRole(outsider.address, Role.Supplier)).to.equal(false);
  });

  it("deactivation removes effective role permissions without deleting the profile", async function () {
    const [, agency] = await ethers.getSigners();
    const deadline = (await time.latest()) + 3600;

    await userRegistry.deactivateUser(agency.address);

    expect(await userRegistry.isActiveUser(agency.address)).to.equal(false);
    expect(await userRegistry.hasUserRole(agency.address, Role.Agency)).to.equal(false);

    await expect(
      tenderRegistry
        .connect(agency)
        .publishTender("BT-TENDER-INACTIVE", ethers.id("inactive-doc"), "ipfs://inactive-doc", deadline, deadline),
    ).to.be.revertedWith("TenderRegistry: agency only");

    await userRegistry.reactivateUser(agency.address);
    expect(await userRegistry.hasUserRole(agency.address, Role.Agency)).to.equal(true);
  });

  it("updates user roles and blocks old role actions", async function () {
    const [, agency] = await ethers.getSigners();
    const deadline = (await time.latest()) + 3600;

    await expect(userRegistry.updateUserRole(agency.address, Role.Auditor))
      .to.emit(userRegistry, "UserRoleUpdated")
      .withArgs(agency.address, Role.Agency, Role.Auditor, anyValue);

    await expect(
      tenderRegistry
        .connect(agency)
        .publishTender("BT-TENDER-AUDITOR", ethers.id("auditor-doc"), "ipfs://auditor-doc", deadline, deadline),
    ).to.be.revertedWith("TenderRegistry: agency only");
  });

  it("publishes and amends a tender only from an active agency", async function () {
    const [, agency, , outsider] = await ethers.getSigners();
    const deadline = (await time.latest()) + 3600;
    const opening = deadline + 600;

    await expect(
      tenderRegistry
        .connect(outsider)
        .publishTender("BT-TENDER-001", ethers.id("tender-doc"), "ipfs://tender-doc", deadline, opening),
    ).to.be.revertedWith("TenderRegistry: agency only");

    await expect(
      tenderRegistry
        .connect(agency)
        .publishTender("BT-TENDER-001", ethers.id("tender-doc"), "ipfs://tender-doc", deadline, opening),
    )
      .to.emit(tenderRegistry, "TenderPublished")
      .withArgs(
        1,
        "BT-TENDER-001",
        agency.address,
        ethers.id("tender-doc"),
        "ipfs://tender-doc",
        deadline,
        opening,
        anyValue,
      );

    await tenderRegistry.connect(agency).addAmendment(1, ethers.id("amendment-1"), "ipfs://amendment-1");
    expect(await tenderRegistry.getAmendmentCount(1)).to.equal(1);
    expect(await tenderRegistry.verifyTenderHash(1, ethers.id("tender-doc"))).to.equal(true);
  });

  it("rejects invalid tender timing and blocks amendments after deadline", async function () {
    const [, agency] = await ethers.getSigners();
    const now = await time.latest();

    await expect(
      tenderRegistry
        .connect(agency)
        .publishTender("BT-TENDER-PAST", ethers.id("past-doc"), "ipfs://past-doc", now, now),
    ).to.be.revertedWith("TenderRegistry: deadline must be future");

    await expect(
      tenderRegistry
        .connect(agency)
        .publishTender("BT-TENDER-BAD-OPENING", ethers.id("bad-doc"), "ipfs://bad-doc", now + 3600, now + 3599),
    ).to.be.revertedWith("TenderRegistry: opening before deadline");

    const { deadline } = await publishTender("BT-TENDER-AMENDMENT");
    await time.increaseTo(deadline);

    await expect(
      tenderRegistry.connect(agency).addAmendment(1, ethers.id("late-amendment"), "ipfs://late-amendment"),
    ).to.be.revertedWith("TenderRegistry: deadline passed");
  });

  it("closes only after deadline and only then allows award workflow", async function () {
    const [, agency] = await ethers.getSigners();
    const { deadline } = await publishTender("BT-TENDER-CLOSE");

    await expect(tenderRegistry.connect(agency).closeTender(1)).to.be.revertedWith(
      "TenderRegistry: deadline not reached",
    );

    await expect(
      awardRegistry.connect(agency).recordOpeningReport(1, ethers.id("early-opening"), "ipfs://early-opening"),
    ).to.be.revertedWith("AwardRegistry: tender not closed");

    await time.increaseTo(deadline);
    await tenderRegistry.connect(agency).closeTender(1);

    const tender = await tenderRegistry.getTender(1);
    expect(tender.status).to.equal(2);
  });

  it("stores bid hashes before the tender deadline and blocks duplicates", async function () {
    const [, agency, supplier] = await ethers.getSigners();
    const deadline = (await time.latest()) + 3600;
    const opening = deadline;

    await tenderRegistry
      .connect(agency)
      .publishTender("BT-TENDER-002", ethers.id("tender-doc-2"), "ipfs://tender-doc-2", deadline, opening);

    await expect(bidRegistry.connect(supplier).submitBid(1, ethers.id("bid-1"), "ipfs://encrypted-bid-1"))
      .to.emit(bidRegistry, "BidSubmitted")
      .withArgs(1, supplier.address, ethers.id("bid-1"), "ipfs://encrypted-bid-1", anyValue);

    await expect(
      bidRegistry.connect(supplier).submitBid(1, ethers.id("bid-duplicate"), "ipfs://encrypted-bid-duplicate"),
    ).to.be.revertedWith("BidRegistry: active bid exists");

    expect(await bidRegistry.getBidderCount(1)).to.equal(1);
    expect(await bidRegistry.verifyBidHash(1, supplier.address, ethers.id("bid-1"))).to.equal(true);
  });

  it("replaces and withdraws bids before deadline, then blocks withdrawn bids from award", async function () {
    const [, agency, supplier] = await ethers.getSigners();
    const { deadline } = await publishTender("BT-TENDER-WITHDRAW");

    await bidRegistry.connect(supplier).submitBid(1, ethers.id("bid-original"), "ipfs://encrypted-bid-original");

    await expect(
      bidRegistry.connect(supplier).replaceBid(1, ethers.id("bid-replaced"), "ipfs://encrypted-bid-replaced"),
    )
      .to.emit(bidRegistry, "BidReplaced")
      .withArgs(
        1,
        supplier.address,
        ethers.id("bid-original"),
        ethers.id("bid-replaced"),
        "ipfs://encrypted-bid-replaced",
        anyValue,
      );

    expect(await bidRegistry.verifyBidHash(1, supplier.address, ethers.id("bid-replaced"))).to.equal(true);

    await expect(bidRegistry.connect(supplier).withdrawBid(1, ethers.id("withdrawal-reason")))
      .to.emit(bidRegistry, "BidWithdrawn")
      .withArgs(1, supplier.address, ethers.id("withdrawal-reason"), anyValue);

    expect(await bidRegistry.hasValidBid(1, supplier.address)).to.equal(false);

    await time.increaseTo(deadline);
    await tenderRegistry.connect(agency).closeTender(1);
    await awardRegistry
      .connect(agency)
      .recordOpeningReport(1, ethers.id("opening-withdrawn"), "ipfs://opening-withdrawn");
    await awardRegistry.connect(agency).recordEvaluation(1, ethers.id("evaluation-withdrawn"));

    await expect(
      awardRegistry.connect(agency).issueIntent(1, supplier.address, ethers.id("intent-withdrawn")),
    ).to.be.revertedWith("AwardRegistry: winner has no valid bid");
  });

  it("blocks bid submission and replacement after the deadline", async function () {
    const [, , supplier] = await ethers.getSigners();
    const { deadline } = await publishTender("BT-TENDER-LATE-BID");

    await bidRegistry.connect(supplier).submitBid(1, ethers.id("bid-before-deadline"), "ipfs://bid-before-deadline");
    await time.increaseTo(deadline);

    await expect(
      bidRegistry.connect(supplier).replaceBid(1, ethers.id("bid-after-deadline"), "ipfs://bid-after-deadline"),
    ).to.be.revertedWith("BidRegistry: deadline passed");

    await expect(
      bidRegistry.connect(supplier).submitBid(1, ethers.id("new-bid-after-deadline"), "ipfs://new-bid-after-deadline"),
    ).to.be.revertedWith("BidRegistry: deadline passed");
  });

  it("requires award sequencing from opening report to evaluation to intent", async function () {
    const [, agency, supplier] = await ethers.getSigners();
    const { deadline } = await publishTender("BT-TENDER-SEQUENCE");

    await bidRegistry.connect(supplier).submitBid(1, ethers.id("sequence-bid"), "ipfs://sequence-bid");
    await time.increaseTo(deadline);
    await tenderRegistry.connect(agency).closeTender(1);

    await expect(
      awardRegistry.connect(agency).recordEvaluation(1, ethers.id("evaluation-before-opening")),
    ).to.be.revertedWith("AwardRegistry: opening not recorded");

    await awardRegistry
      .connect(agency)
      .recordOpeningReport(1, ethers.id("sequence-opening"), "ipfs://sequence-opening");

    await expect(
      awardRegistry.connect(agency).issueIntent(1, supplier.address, ethers.id("intent-before-evaluation")),
    ).to.be.revertedWith("AwardRegistry: evaluation not recorded");
  });

  it("allows cancelling an in-progress award before final confirmation", async function () {
    const [, agency, supplier] = await ethers.getSigners();
    const { deadline } = await publishTender("BT-TENDER-CANCEL-AWARD");

    await bidRegistry.connect(supplier).submitBid(1, ethers.id("cancel-award-bid"), "ipfs://cancel-award-bid");
    await time.increaseTo(deadline);
    await tenderRegistry.connect(agency).closeTender(1);

    await awardRegistry.connect(agency).recordOpeningReport(1, ethers.id("cancel-opening"), "ipfs://cancel-opening");
    await awardRegistry.connect(agency).recordEvaluation(1, ethers.id("cancel-evaluation"));

    await expect(awardRegistry.connect(agency).cancelAward(1, ethers.id("cancel-reason")))
      .to.emit(awardRegistry, "AwardCancelled")
      .withArgs(1, ethers.id("cancel-reason"), anyValue);

    const award = await awardRegistry.getAward(1);
    expect(award.status).to.equal(4);
  });

  it("records opening, evaluation, intent, and final award after standstill", async function () {
    const [, agency, supplier] = await ethers.getSigners();
    const deadline = (await time.latest()) + 3600;
    const opening = deadline;

    await tenderRegistry
      .connect(agency)
      .publishTender("BT-TENDER-003", ethers.id("tender-doc-3"), "ipfs://tender-doc-3", deadline, opening);
    await bidRegistry.connect(supplier).submitBid(1, ethers.id("bid-3"), "ipfs://encrypted-bid-3");

    await time.increaseTo(deadline);
    await tenderRegistry.connect(agency).closeTender(1);

    await awardRegistry.connect(agency).recordOpeningReport(1, ethers.id("opening-report"), "ipfs://opening-report");
    await awardRegistry.connect(agency).recordEvaluation(1, ethers.id("evaluation-report"));
    await awardRegistry.connect(agency).issueIntent(1, supplier.address, ethers.id("letter-of-intent"));

    await expect(
      awardRegistry.connect(agency).confirmAward(1, supplier.address, ethers.id("award-doc"), "ipfs://award-doc", 1000),
    ).to.be.revertedWith("AwardRegistry: standstill active");

    await time.increase(10 * 24 * 60 * 60);
    await expect(
      awardRegistry.connect(agency).confirmAward(1, supplier.address, ethers.id("award-doc"), "ipfs://award-doc", 1000),
    )
      .to.emit(awardRegistry, "AwardConfirmed")
      .withArgs(1, supplier.address, ethers.id("award-doc"), "ipfs://award-doc", 1000, anyValue);

    const tender = await tenderRegistry.getTender(1);
    expect(tender.status).to.equal(4);
    expect(await awardRegistry.verifyAwardHash(1, ethers.id("award-doc"))).to.equal(true);
  });
});
