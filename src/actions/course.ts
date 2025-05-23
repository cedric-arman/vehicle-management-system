'use server';

import { RowDataPacket } from 'mysql2';
import pool from '@/lib/db';

export async function getCourseIdByName(
  courseName: string
): Promise<number | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT id FROM courses WHERE course_name = ?',
    [courseName]
  );

  if (rows.length === 0) return null;
  return rows[0].id;
}
