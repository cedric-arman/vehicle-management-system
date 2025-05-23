'use client';

import { useEffect, useState, useTransition } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getCourseIdByName } from '@/actions/course';
import {
  deleteVehicle,
  getVehicles,
  insertVehicle,
  updateVehicle,
} from '@/actions/vehicle';
import { Vehicle } from '@/types/vehicle';

export default function Page() {
  const { courseName } = useParams();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formDataState, setFormDataState] = useState({
    student_name: '',
    vehicle_type: '',
    registered_owner: '',
    plate_number: '',
    license_number: '',
  });

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      const id = await getCourseIdByName(courseName as string);
      if (id !== null) {
        setCourseId(id);
        const data = await getVehicles(id);
        setVehicles(data);
      }
      setIsFetching(false);
    }
    fetchData();
  }, [courseName]);

  async function handleSubmit(formData: FormData) {
    if (!courseId) return;
    setIsSaving(true);

    startTransition(async () => {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, formData, courseId);
      } else {
        const result = await insertVehicle(formData, courseId);
        if (!result.success) {
          Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: result.message || 'Something went wrong',
            timer: 2000,
            showConfirmButton: false,
          });
          setIsSaving(false);
          return;
        }
      }

      setIsDialogOpen(false);
      setEditingVehicle(null);
      const data = await getVehicles(courseId);
      setVehicles(data);

      setIsSaving(false);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Vehicle registered successfully.',
        timer: 2000,
        showConfirmButton: false,
      });
    });
  }

  function openEditDialog(vehicle: Vehicle) {
    setEditingVehicle(vehicle);
    setFormDataState({
      student_name: vehicle.student_name,
      vehicle_type: vehicle.vehicle_type,
      registered_owner: vehicle.registered_owner,
      plate_number: vehicle.plate_number,
      license_number: vehicle.license_number,
    });
    setIsDialogOpen(true);
  }

  function openAddDialog() {
    setEditingVehicle(null);
    setFormDataState({
      student_name: '',
      vehicle_type: '',
      registered_owner: '',
      plate_number: '',
      license_number: '',
    });
    setIsDialogOpen(true);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormDataState({
      ...formDataState,
      [e.target.name]: e.target.value,
    });
  };

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      startTransition(async () => {
        await deleteVehicle(id);
        const data = await getVehicles(courseId!);
        setVehicles(data);
        Swal.fire('Deleted!', 'The vehicle has been deleted.', 'success');
      });
    }
  }

  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="flex items-center justify-between mt-3 mb-6">
        <h1 className="text-2xl font-bold">{courseName}</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form action={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                </DialogTitle>
                <DialogDescription>
                  {editingVehicle
                    ? 'Edit the details of the student vehicle.'
                    : 'Fill in the details to register a new student vehicle.'}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <Label>Student Name</Label>
                <Input
                  name="student_name"
                  value={formDataState.student_name}
                  onChange={handleInputChange}
                />
                <Label>Vehicle Type</Label>
                <Input
                  name="vehicle_type"
                  value={formDataState.vehicle_type}
                  onChange={handleInputChange}
                />
                <Label>Registered Owner</Label>
                <Input
                  name="registered_owner"
                  value={formDataState.registered_owner}
                  onChange={handleInputChange}
                />
                <Label>Plate Number</Label>
                <Input
                  name="plate_number"
                  value={formDataState.plate_number}
                  onChange={handleInputChange}
                />
                <Label>License Number</Label>
                <Input
                  name="license_number"
                  value={formDataState.license_number}
                  onChange={handleInputChange}
                />
              </div>

              <Button type="submit" disabled={isSaving}>
                {isSaving
                  ? 'Saving...'
                  : editingVehicle
                  ? 'Update Vehicle'
                  : 'Save Vehicle'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isFetching ? (
        <p>Loading Vehicles...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Plate</TableHead>
              <TableHead>License</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell>{vehicle.student_name}</TableCell>
                <TableCell>{vehicle.vehicle_type}</TableCell>
                <TableCell>{vehicle.registered_owner}</TableCell>
                <TableCell>{vehicle.plate_number}</TableCell>
                <TableCell>{vehicle.license_number}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => openEditDialog(vehicle)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(vehicle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
