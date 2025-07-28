'use client';
import React, { useEffect } from 'react';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { useStore } from '~/lib/zustand';
import { useUnifiedProvider } from '~/hooks/useUnifiedProvider';
import { cn } from '~/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '~/components/ui/switch';

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  url: z.url({ message: 'Must be a valid URL' }).min(1, { message: 'URL is required' }),
  verifyUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.url().safeParse(val).success, {
      message: 'Must be a valid URL or empty',
    }),
  redirect: z
    .object({
      native: z.string().optional(),
      universal: z.string().optional(),
      linkMode: z.boolean().optional(),
    })
    .optional(),
});

// Define the form data type
type FormData = z.infer<typeof formSchema>;

// Assume the store has methods to handle metadata
interface MetadataStore {
  metadata: FormData | null;
  setMetadata: (metadata: FormData) => void;
}

const MetadataForm = () => {
  const { metadata, setMetadata } = useStore();

  // Initialize React Hook Form with Zod resolver
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name: metadata?.name || '',
      description: metadata?.description || '',
      url: metadata?.url || '',
      verifyUrl: metadata?.verifyUrl || '',
      redirect: {
        native: metadata?.redirect?.native || '',
        universal: metadata?.redirect?.universal || '',
        linkMode: metadata?.redirect?.linkMode || false,
      },
    },
  });

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
  } = form;

  // Sync metadata from store to form
  useEffect(() => {
    if (metadata) {
      setValue('name', metadata.name || '', { shouldValidate: true });
      setValue('description', metadata.description || '', { shouldValidate: true });
      setValue('url', metadata.url || '', { shouldValidate: true });
      setValue('verifyUrl', metadata.verifyUrl || '', { shouldValidate: true });
      setValue('redirect.native', metadata.redirect?.native || '', { shouldValidate: true });
      setValue('redirect.universal', metadata.redirect?.universal || '', { shouldValidate: true });
      setValue('redirect.linkMode', metadata.redirect?.linkMode || false, {
        shouldValidate: true,
      });
    }
  }, [metadata, setValue]);

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      setMetadata({ ...data, icons: [] });
      console.log('Form submitted successfully:', data);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 pt-3 px-1" noValidate>
      <Label className="font-bold">Project Metadata</Label>

      {/* Name */}
      <div className="space-y-2 overflow-visible">
        <Label htmlFor="name">Name</Label>
        <Input
          {...register('name')}
          id="name"
          placeholder="Enter project name"
          data-variant={errors.name ? 'Red' : 'Default'}
          className={cn('w-full', errors.name && 'border-color8')}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name?.message && (
          <span data-variant="Red" id="name-error" className="text-sm text-color8">
            {errors.name.message}
          </span>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2 overflow-visible">
        <Label htmlFor="description">Description</Label>
        <Input
          {...register('description')}
          id="description"
          placeholder="Enter project description"
          data-variant={errors.description ? 'Red' : 'Default'}
          className={cn('w-full', errors.description && 'border-color8')}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description?.message && (
          <span data-variant="Red" id="description-error" className="text-sm text-color8">
            {errors.description.message}
          </span>
        )}
      </div>

      {/* URL */}
      <div className="space-y-2 overflow-visible">
        <Label htmlFor="url">Project URL</Label>
        <Input
          {...register('url')}
          id="url"
          placeholder="Enter project URL"
          data-variant={errors.url ? 'Red' : 'Default'}
          className={cn('w-full', errors.url && 'border-color8')}
          aria-invalid={!!errors.url}
          aria-describedby={errors.url ? 'url-error' : undefined}
        />
        {errors.url?.message && (
          <span data-variant="Red" id="url-error" className="text-sm text-color8">
            {errors.url.message}
          </span>
        )}
      </div>

      {/* Verify URL (Optional) */}
      <div className="space-y-2 overflow-visible">
        <Label htmlFor="verifyUrl">Verify URL (Optional)</Label>
        <Input
          {...register('verifyUrl')}
          id="verifyUrl"
          placeholder="Enter verification URL"
          data-variant={errors.verifyUrl ? 'Red' : 'Default'}
          className={cn('w-full', errors.verifyUrl && 'border-color8')}
          aria-invalid={!!errors.verifyUrl}
          aria-describedby={errors.verifyUrl ? 'verifyUrl-error' : undefined}
        />
        {errors.verifyUrl?.message && (
          <span data-variant="Red" id="verifyUrl-error" className="text-sm text-color8">
            {errors.verifyUrl.message}
          </span>
        )}
      </div>

      {/* Redirect Fields */}
      <div className="space-y-2 overflow-visible">
        <Label htmlFor="redirect.native">Redirect - Native (Optional)</Label>
        <Input
          {...register('redirect.native')}
          id="redirect.native"
          placeholder="Enter native redirect URL"
          data-variant={errors.redirect?.native ? 'Red' : 'Default'}
          className={cn('w-full', errors.redirect?.native && 'border-color8')}
          aria-invalid={!!errors.redirect?.native}
          aria-describedby={errors.redirect?.native ? 'redirect-native-error' : undefined}
        />
        {errors.redirect?.native?.message && (
          <span data-variant="Red" id="redirect-native-error" className="text-sm text-color8">
            {errors.redirect.native.message}
          </span>
        )}
      </div>

      <div className="space-y-2 overflow-visible">
        <Label htmlFor="redirect.universal">Redirect - Universal (Optional)</Label>
        <Input
          {...register('redirect.universal')}
          id="redirect.universal"
          placeholder="Enter universal redirect URL"
          data-variant={errors.redirect?.universal ? 'Red' : 'Default'}
          className={cn('w-full', errors.redirect?.universal && 'border-color8')}
          aria-invalid={!!errors.redirect?.universal}
          aria-describedby={errors.redirect?.universal ? 'redirect-universal-error' : undefined}
        />
        {errors.redirect?.universal?.message && (
          <span data-variant="Red" id="redirect-universal-error" className="text-sm text-color8">
            {errors.redirect.universal.message}
          </span>
        )}
      </div>

      <div className="space-y-2 overflow-visible">
        <Label htmlFor="redirect.linkMode">Redirect - Link Mode (Optional)</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-color11 grow">Enable Link Mode</span>
          <Switch
            data-variant="Accent"
            {...register('redirect.linkMode')}
            id="redirect.linkMode"
            className={cn(errors.redirect?.linkMode && 'border-destructive')}
            aria-invalid={!!errors.redirect?.linkMode}
            aria-describedby={errors.redirect?.linkMode ? 'redirect-linkMode-error' : undefined}
          />
        </div>
        {errors.redirect?.linkMode?.message && (
          <span data-variant="Red" id="redirect-linkMode-error" className="text-sm text-color8">
            {errors.redirect.linkMode.message}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 overflow-visible">
        <Button type="submit" theme="Accent" disabled={!isValid}>
          Submit
        </Button>
      </div>
    </form>
  );
};

export default MetadataForm;
