import bcrypt from 'bcrypt';
import { db } from '../server/db.js';
import { adminUsers } from '../shared/schema.js';

async function createAdminUser() {
  const username = 'admin';
  const password = 'admin123'; // In production, use a strong password
  const email = 'castlemotorsatl@gmail.com';
  
  try {
    // Check if admin already exists
    const existingAdmin = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    
    if (existingAdmin.length > 0) {
      console.log('Admin user already exists');
      return;
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create admin user
    const [admin] = await db.insert(adminUsers).values({
      username,
      password: hashedPassword,
      email
    }).returning();
    
    console.log('Admin user created successfully:');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Email:', email);
    console.log('ID:', admin.id);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();