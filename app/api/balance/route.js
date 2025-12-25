import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
const connectDB = require('../../../lib/mongodb');
const User = require('../../../lib/models/User');

// GET user's initial balance
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: { initialBalance: user.initialBalance || 0 } 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// PUT update user's initial balance
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { initialBalance } = await request.json();

    if (initialBalance === undefined || initialBalance < 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid balance amount' },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { initialBalance: parseFloat(initialBalance) },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: { initialBalance: user.initialBalance } 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}