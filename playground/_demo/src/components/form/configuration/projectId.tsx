'use client';
import React, { useEffect } from 'react';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { useStore } from '~/lib/zustand';
import { cn } from '~/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '~/components/ui/label';

// Define the form schema using Zod
const formSchema = z.object({
  projectId: z.string().min(1, { message: 'Project ID is required' }),
});

// Define the form data type
type FormData = z.infer<typeof formSchema>;

const Index = () => {
  const { projectId, setProjectId } = useStore();

  // Initialize React Hook Form with Zod resolver
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      projectId: projectId || '',
    },
  });

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
  } = form;

  // Sync projectId from store to form
  useEffect(() => {
    setValue('projectId', projectId || '', { shouldValidate: true });
  }, [projectId, setValue]);

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      setProjectId(data.projectId);
      console.log('Form submitted successfully:', data);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 pt-3 px-1" noValidate>
      <div className="space-y-2 overflow-visible">
        <Label htmlFor="projectId">Project ID</Label>
        <Input
          {...register('projectId')}
          placeholder="Enter Project ID"
          data-variant={errors.projectId ? 'Red' : 'Default'}
          className={cn('w-full', errors.projectId && 'border-color8')}
          aria-invalid={!!errors.projectId}
          aria-describedby={errors.projectId ? 'projectId-error' : undefined}
        />
        {errors.projectId?.message ? (
          <span data-variant="Red" id="projectId-error" className="text-sm text-color8">
            {errors.projectId.message}
          </span>
        ) : (
          <span id="projectId-error" className="text-sm text-color11">
            ProjectId acquired using the Rewown Dashboard
          </span>
        )}
      </div>
      <div className="flex justify-end gap-3">
        <Button type="submit" theme="Accent" disabled={!isValid}>
          Submit
        </Button>
      </div>
    </form>
  );
};

export default Index;
