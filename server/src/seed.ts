import prisma from './lib/prisma';

async function main() {
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      passwordHash: '$2a$12$1234567890123456789012',
      status: 'active',
      userProfiles: {
        create: {
          displayName: 'Test User',
          timezone: 'UTC',
        },
      },
      userSettings: {
        create: {
          units: 'metric',
          weekStartsOn: 'monday',
          biometricUnlockEnabled: false,
          pushNotificationsEnabled: true,
          dataSharingAnalyticsOptIn: false,
        },
      },
    },
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
