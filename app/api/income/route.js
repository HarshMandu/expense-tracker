import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import connectDB from '../../../lib/mongodb';
import Income from '../../../lib/models/Income';

// GET all income for logged-in user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const income = await Income.find({ userId: session.user.id }).sort({ date: -1 });
    return NextResponse.json({ success: true, data: income });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// POST new income
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const income = await Income.create({
      ...body,
      userId: session.user.id,
    });
    return NextResponse.json({ success: true, data: income }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// PUT update income
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { id, ...updateData } = body;
    
    // Make sure user owns this income
    const income = await Income.findOne({ _id: id, userId: session.user.id });
    if (!income) {
      return NextResponse.json({ success: false, error: 'Income not found' }, { status: 404 });
    }

    const updatedIncome = await Income.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    
    return NextResponse.json({ success: true, data: updatedIncome });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE income
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Make sure user owns this income
    const income = await Income.findOneAndDelete({ _id: id, userId: session.user.id });
    if (!income) {
      return NextResponse.json({ success: false, error: 'Income not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}