'use client';
import { useRouter } from 'next/navigation';
import TenderCreateForm from '@/components/agency/TenderCreateForm';

export default function TenderCreatePage() {
  const router = useRouter();

  const handleCreateTender = async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('estimatedAmount', data.estimatedAmount);
      formData.append('submissionDeadline', data.submissionDeadline);
      formData.append('tenderHash', data.tenderHash);
      formData.append('file', data.file);
      formData.append('agencyId', 'agency-uuid'); // In real case, from session

      const res = await fetch('/api/agency/tenders', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        router.push('/agency/tenders');
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to create tender.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Create New Tender</h1>
        <p className="text-gray-500">Prepare your procurement documents and set submission rules.</p>
      </div>

      <div className="card">
        <TenderCreateForm onSubmit={handleCreateTender} />
      </div>
    </div>
  );
}
