import pool from '../config/database';

const addImagesColumn = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Add images column to products table if it doesn't exist
    await client.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS images TEXT[];
    `);

    await client.query('COMMIT');
    console.log('✅ Images column added to products table successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error adding images column:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  addImagesColumn()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export default addImagesColumn;
