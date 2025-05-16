import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth/auth';
import { z } from 'zod';
import { debugLog } from '@/lib/debug';

const updateCurrencySchema = z.object({
    currency: z.string().min(1).max(10),
});

// GET user's current currency
export async function GET() {
    try {
        const session = await auth();
        debugLog('GET currency - Session:', session);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { currency: true },
        });

        debugLog('GET currency - User data:', user);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ currency: user.currency });
    } catch (error) {
        console.error('Error fetching user currency:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user currency' },
            { status: 500 }
        );
    }
}

// PUT update user's currency
export async function PUT(request: NextRequest) {
    try {
        const session = await auth();
        debugLog('PUT currency - Session:', session);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        debugLog('PUT currency - Request body:', body);

        const { currency } = updateCurrencySchema.parse(body);

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { currency },
            select: { currency: true },
        });

        debugLog('PUT currency - Updated user:', updatedUser);

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating user currency:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Validation error', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to update user currency' },
            { status: 500 }
        );
    }
}