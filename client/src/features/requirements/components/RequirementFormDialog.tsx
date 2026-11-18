import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  PRIORITIES,
  PRIORITY_LABELS,
  PROJECTS,
  REQUIREMENT_STATUSES,
  STATUS_LABELS,
  TAG_OPTIONS,
  TEAM_MEMBERS,
  TYPE_LABELS,
  REQUIREMENT_TYPES,
} from '../constants';
import {
  useRequirements,
} from '../requirement-store';
import type { Requirement, RequirementInput } from '../types';

const schema = z.object({
  title: z.string().min(1, '请输入需求标题'),
  description: z.string(),
  project: z.string().min(1, '请选择所属项目'),
  type: z.enum(REQUIREMENT_TYPES),
  priority: z.enum(PRIORITIES),
  status: z.enum(REQUIREMENT_STATUSES),
  owner: z.string().min(1, '请选择负责人'),
  tags: z.array(z.string()),
  dueDate: z.string().nullable(),
});

type FormValues = z.infer<typeof schema>;

interface RequirementFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: Requirement | null;
}

const buildDefaults = (initial: Requirement | null): FormValues =>
  initial
    ? {
        title: initial.title,
        description: initial.description,
        project: initial.project,
        type: initial.type,
        priority: initial.priority,
        status: initial.status,
        owner: initial.owner,
        tags: initial.tags,
        dueDate: initial.dueDate,
      }
    : {
        title: '',
        description: '',
        project: PROJECTS[0],
        type: 'feature',
        priority: 'P2',
        status: 'backlog',
        owner: TEAM_MEMBERS[0],
        tags: [],
        dueDate: null,
      };

const RequirementFormDialog = ({
  open,
  onOpenChange,
  initial,
}: RequirementFormDialogProps) => {
  const { addRequirement, updateRequirement } = useRequirements();
  const isEdit = initial !== null;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: buildDefaults(initial),
  });

  useEffect(() => {
    if (open) {
      form.reset(buildDefaults(initial));
    }
  }, [open, initial, form]);

  const onSubmit = (values: FormValues) => {
    const payload: RequirementInput = {
      title: values.title.trim(),
      description: values.description.trim(),
      project: values.project,
      type: values.type,
      priority: values.priority,
      status: values.status,
      owner: values.owner,
      tags: values.tags,
      dueDate: values.dueDate,
    };
    if (isEdit) {
      updateRequirement(initial.id, payload);
      toast.success('需求已更新');
    } else {
      addRequirement(payload);
      toast.success('需求已创建');
    }
    onOpenChange(false);
  };

  const toggleTag = (tag: string, selected: boolean) => {
    const current = form.getValues('tags');
    form.setValue(
      'tags',
      selected ? current.filter((t) => t !== tag) : [...current, tag],
      { shouldDirty: true },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit ? '编辑需求' : '新建需求'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? '修改需求信息后保存，更新时间会自动刷新。' : '填写需求信息，带 * 为必填项。'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    需求标题 <span aria-hidden="true" className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="简明描述要做什么" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>需求描述</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="背景、目标、验收标准等"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap gap-4">
              <FormField
                control={form.control}
                name="project"
                render={({ field }) => (
                  <FormItem className="flex-1 basis-56">
                    <FormLabel>
                      所属项目 <span aria-hidden="true" className="text-destructive">*</span>
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择项目" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROJECTS.map((project) => (
                          <SelectItem key={project} value={project}>
                            {project}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem className="flex-1 basis-56">
                    <FormLabel>
                      负责人 <span aria-hidden="true" className="text-destructive">*</span>
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择负责人" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TEAM_MEMBERS.map((member) => (
                          <SelectItem key={member} value={member}>
                            {member}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex-1 basis-44">
                    <FormLabel>需求类型</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {REQUIREMENT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {TYPE_LABELS[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="flex-1 basis-44">
                    <FormLabel>优先级</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRIORITIES.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {PRIORITY_LABELS[priority]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex-1 basis-44">
                    <FormLabel>状态</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {REQUIREMENT_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>截止日期</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            'w-full justify-start font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? dayjs(field.value).format('YYYY-MM-DD')
                            : '选择截止日期（可空）'}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value
                            ? new Date(`${field.value}T00:00:00`)
                            : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(
                            date ? dayjs(date).format('YYYY-MM-DD') : null,
                          )
                        }
                      />
                      {field.value && (
                        <div className="border-t border-border p-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="w-full"
                            onClick={() => field.onChange(null)}
                          >
                            清除日期
                          </Button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel>标签</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {TAG_OPTIONS.map((tag) => {
                      const selected = form.getValues('tags').includes(tag);
                      return (
                        <Button
                          key={tag}
                          type="button"
                          variant={selected ? 'default' : 'outline'}
                          size="sm"
                          aria-pressed={selected}
                          className="h-7 rounded-full text-xs"
                          onClick={() => toggleTag(tag, selected)}
                        >
                          {tag}
                        </Button>
                      );
                    })}
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                取消
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {isEdit ? '保存修改' : '创建需求'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RequirementFormDialog;
