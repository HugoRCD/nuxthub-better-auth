import * as z from 'zod'
import type { InvitationStatus } from 'better-auth/plugins'

export const createTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  slug: z.string().min(1, 'Team slug is required'),
  logo: z.string().optional()
})

export type CreateTeamSchema = z.output<typeof createTeamSchema>

export type FullOrganization = {
    members: {
        id: string;
        organizationId: string;
        role: 'admin' | 'member' | 'owner';
        createdAt: Date;
        userId: string;
        user: {
            email: string;
            name: string;
            image?: string;
        };
    }[];
    invitations: {
        id: string;
        organizationId: string;
        email: string;
        role: 'admin' | 'member' | 'owner';
        status: InvitationStatus;
        inviterId: string;
        expiresAt: Date;
    }[];
} & {
    id: string;
    name: string;
    createdAt: Date;
    slug: string;
    metadata?: any;
    logo?: string | null | undefined;
}
