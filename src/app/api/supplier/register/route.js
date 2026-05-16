import { NextResponse } from 'next/server';
import { SupplierRegistrationService } from '@/services/registration.service';

export async function POST(request) {
  try {
    const body = await request.json();
    const { formData, documentData } = body;

    // Validate required fields
    if (!formData.company_name || !formData.email || !formData.license_number) {
      return new Response(JSON.stringify({ error: 'Missing required supplier fields' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const supplier = await SupplierRegistrationService.register(formData, documentData);

    return NextResponse.json({ success: true, data: supplier });
  } catch (error) {
    console.error('CRITICAL: Supplier Registration API Error:', error);

    // Handle Postgres Unique Constraint Violation (Error Code 23505)
    if (error.code === '23505') {
      let field = 'information';
      if (error.message.includes('email')) field = 'email address';
      if (error.message.includes('license_number')) field = 'license number';
      
      return new Response(JSON.stringify({ 
        error: `This ${field} is already registered in our system. Please use unique details.` 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      error: error.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
