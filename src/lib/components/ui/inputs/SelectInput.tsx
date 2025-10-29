import { CheckCircle2Icon, ChevronDown } from 'lucide-react'
import { Select as SelectPrimitive } from 'radix-ui'
import { type ComponentProps } from 'react'

import { cn } from '$/lib/utils/styling'

interface SelectInputProps
  extends ComponentProps<typeof SelectPrimitive.Trigger> {
  options: Array<{
    value: string
    label: string
  }>
  defaultValue?: string
  placeholder?: string
  onValueChange?: (value: string) => void
}

export default function SelectInput({
  onValueChange,
  ...props
}: SelectInputProps) {
  return (
    <SelectPrimitive.Root
      defaultValue={props.defaultValue}
      onValueChange={onValueChange}
    >
      <SelectPrimitive.Trigger
        {...props}
        className={cn(
          "group flex w-full justify-between rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-hidden duration-200 focus-within:outline-primary focus:border-accent disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-grey data-[state='open']:border-accent aria-invalid:border-danger focus:aria-invalid:border-accent aria-invalid:data-[state='open']:border-accent",
          props.className,
        )}
      >
        <SelectPrimitive.Value placeholder={props.placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDown className="size-5 text-text duration-150 group-data-[state='open']:rotate-180" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Content
        position="popper"
        align="center"
        className="z-20 mt-0.5 rounded-md border border-border bg-white px-1 py-1 shadow-lg shadow-black/10"
        style={{
          width: 'var(--radix-select-trigger-width)',
        }}
      >
        <SelectPrimitive.Viewport>
          {props.options.map((option) => {
            return (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="group relative mt-0.75 rounded-md px-3 py-2 text-sm duration-75 outline-none first:mt-0 data-highlighted:bg-grey/5 data-[state='checked']:bg-grey/20 data-[state='checked']:data-highlighted:bg-grey/10"
              >
                <SelectPrimitive.ItemText>
                  {option.label}
                </SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute top-1/2 right-2 -translate-y-1/2">
                  <CheckCircle2Icon className="w-4" />
                </SelectPrimitive.ItemIndicator>
                <div className="absolute -bottom-0.5 left-2 h-px w-[calc(100%-1rem)] bg-border group-last:hidden"></div>
              </SelectPrimitive.Item>
            )
          })}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Root>
  )
}
