#!/usr/bin/env node

const crypto = require('crypto');

console.log('\n🔐 Génération des secrets pour votre application E-Visa\n');
console.log('='.repeat(60));

const nextAuthSecret = crypto.randomBytes(32).toString('base64');
const jwtSecret = crypto.randomBytes(32).toString('base64');

console.log('\nCopiez ces valeurs dans votre fichier .env.local:\n');
console.log('NEXTAUTH_SECRET="' + nextAuthSecret + '"');
console.log('JWT_SECRET="' + jwtSecret + '"');

console.log('\n='.repeat(60));
console.log('\n✅ Secrets générés avec succès!\n');
console.log('📝 N\'oubliez pas de configurer également:\n');
console.log('   - DATABASE_URL (MongoDB connection string)');
console.log('   - GOOGLE_CLIENT_ID (depuis Google Cloud Console)');
console.log('   - GOOGLE_CLIENT_SECRET (depuis Google Cloud Console)');
console.log('   - NEXTAUTH_URL (http://localhost:3000 en dev)\n');
console.log('📖 Consultez SETUP_INSTRUCTIONS.md pour plus de détails.\n');

