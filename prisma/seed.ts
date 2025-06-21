import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // Create test users with different roles
    const users = [
        {
            email: 'user@example.com',
            name: 'Test User',
            phone: '+1234567890',
            role: 'user',
            password: 'password123'
        },
        {
            email: 'security@company.com',
            name: 'Security Admin',
            phone: '+1234567891',
            role: 'security',
            password: 'password123'
        },
        {
            email: 'hr@company.com',
            name: 'HR Admin',
            phone: '+1234567892',
            role: 'department_admin',
            department: 'HR',
            password: 'password123'
        }
    ]

    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10)
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                email: user.email,
                name: user.name,
                phone: user.phone,
                role: user.role,
                department: user.department,
                password: hashedPassword
            }
        })
    }

    console.log('Database has been seeded. 🌱')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    }) 