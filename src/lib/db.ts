import mysql2 from 'mysql2/promise';

const pool = mysql2.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'vehicle_registration_system',
  port: 3307,
});

export default pool;
