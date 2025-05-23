'use server';

import { revalidatePath } from 'next/cache';
import pool from '@/lib/db';
import { Vehicle } from '@/types/vehicle';
import { RowDataPacket } from 'mysql2';

export async function insertVehicle(
  formData: FormData
): Promise<{ success: boolean; message?: string }> {
  const newVehicle = {
    studentName: formData.get('student_name') as string,
    course: formData.get('course') as string,
    vehicleType: formData.get('vehicle_type') as string,
    registeredOwner: formData.get('registered_owner') as string,
    plateNumber: formData.get('plate_number') as string,
    licenseNumber: formData.get('license_number') as string,
  };

  try {
    const [existingPlateNumber] = await pool.query<(Vehicle & RowDataPacket)[]>(
      'SELECT * FROM student_vehicle_info WHERE plate_number = ?',
      [newVehicle.plateNumber]
    );

    if (existingPlateNumber.length > 0) {
      return { success: false, message: 'Plate number already exists' };
    }

    await pool.query(
      'INSERT INTO student_vehicle_info (student_name, course, vehicle_type, registered_owner, plate_number, license_number) VALUES (?, ?, ?, ?, ?, ?)',
      [
        newVehicle.studentName,
        newVehicle.course,
        newVehicle.vehicleType,
        newVehicle.registeredOwner,
        newVehicle.plateNumber,
        newVehicle.licenseNumber,
      ]
    );

    revalidatePath('/dashboard');
    return { success: true };
  } catch (err) {
    console.error('Database error:', err);
    return { success: false, message: 'Something went wrong' };
  }
}

export async function getVehicles() {
  const [rows] = await pool.query('SELECT * FROM student_vehicle_info');
  return rows as Vehicle[];
}

export async function updateVehicle(id: number, formData: FormData) {
  const updatedVehicle = {
    studentName: formData.get('student_name') as string,
    course: formData.get('course') as string,
    vehicleType: formData.get('vehicle_type') as string,
    registeredOwner: formData.get('registered_owner') as string,
    plateNumber: formData.get('plate_number') as string,
    licenseNumber: formData.get('license_number') as string,
  };

  await pool.query(
    'UPDATE student_vehicle_info SET student_name = ?, course = ?, vehicle_type = ?, registered_owner = ?, plate_number = ?, license_number = ? WHERE id = ?',
    [
      updatedVehicle.studentName,
      updatedVehicle.course,
      updatedVehicle.vehicleType,
      updatedVehicle.registeredOwner,
      updatedVehicle.plateNumber,
      updatedVehicle.licenseNumber,
      id,
    ]
  );

  revalidatePath('/dashboard');
}

export async function deleteVehicle(id: number) {
  await pool.query('DELETE FROM student_vehicle_info WHERE id = ?', [id]);
  revalidatePath('/dashboard');
}
