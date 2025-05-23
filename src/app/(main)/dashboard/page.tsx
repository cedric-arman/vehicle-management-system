'use client';

import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  deleteVehicle,
  getVehicles,
  insertVehicle,
  updateVehicle,
} from '@/actions/vehicle';
import { Vehicle } from '@/types/vehicle';

export default function Page() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formDataState, setFormDataState] = useState({
    student_name: '',
    course: '',
    vehicle_type: '',
    registered_owner: '',
    plate_number: '',
    license_number: '',
  });

  useEffect(() => {
    async function fetchData() {
      const data = await getVehicles();
      setVehicles(data);
    }
    fetchData();
  }, []);

  function openEditDialog(vehicle: Vehicle) {
    setEditingVehicle(vehicle);
    setFormDataState({
      student_name: vehicle.student_name,
      course: vehicle.course,
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
      course: '',
      vehicle_type: '',
      registered_owner: '',
      plate_number: '',
      license_number: '',
    });
    setIsDialogOpen(true);
  }

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, formData);
      } else {
        const result = await insertVehicle(formData);

        if (!result.success) {
          Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: result.message || 'Something went wrong',
            timer: 2000,
            showConfirmButton: false,
          });
          return;
        }
      }

      setIsDialogOpen(false);
      setEditingVehicle(null);
      const data = await getVehicles();
      setVehicles(data);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Vehicle registered successfully.',
        timer: 2000,
        showConfirmButton: false,
      });
    });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormDataState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

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
        const data = await getVehicles();
        setVehicles(data);
        Swal.fire('Deleted!', 'The vehicle has been deleted.', 'success');
      });
    }
  }

  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="flex items-center justify-between mt-3 mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
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
                {[
                  {
                    id: 'student_name',
                    label: 'Student Name',
                    placeholder: 'Juan Dela Cruz',
                  },
                  {
                    id: 'course',
                    label: 'Course',
                    placeholder: 'BSIT, BSA, etc.',
                  },
                  {
                    id: 'vehicle_type',
                    label: 'Vehicle Type',
                    placeholder: 'Car, Motorcycle',
                  },
                  {
                    id: 'registered_owner',
                    label: 'Registered Owner',
                    placeholder: 'Name of Owner',
                  },
                  {
                    id: 'plate_number',
                    label: 'Plate Number',
                    placeholder: 'ABC-1234',
                  },
                  {
                    id: 'license_number',
                    label: 'License Number',
                    placeholder: '1234567890',
                  },
                ].map(({ id, label, placeholder }) => (
                  <div className="grid grid-cols-4 items-center gap-4" key={id}>
                    <Label htmlFor={id} className="text-right">
                      {label}
                    </Label>
                    <Input
                      name={id}
                      id={id}
                      placeholder={placeholder}
                      className="col-span-3"
                      required
                      value={formDataState[id as keyof typeof formDataState]}
                      onChange={handleInputChange}
                    />
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Saving...' : 'Save'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Plate</TableHead>
            <TableHead>License</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>{vehicle.student_name}</TableCell>
              <TableCell>{vehicle.course}</TableCell>
              <TableCell>{vehicle.vehicle_type}</TableCell>
              <TableCell>{vehicle.registered_owner}</TableCell>
              <TableCell>{vehicle.plate_number}</TableCell>
              <TableCell>{vehicle.license_number}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditDialog(vehicle)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(vehicle.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
