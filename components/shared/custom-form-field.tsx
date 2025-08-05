/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { format } from "date-fns";
import { E164Number } from "libphonenumber-js/core";
import {
  CalendarIcon,
  ChevronDown,
  EyeIcon,
  EyeOffIcon,
  Search,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import {
  Control,
  FieldValues,
  Path,
  UseControllerReturn,
} from "react-hook-form";
import PhoneInput from "react-phone-number-input";

import { FormFieldTypes } from "@/config/enum";
import { cn } from "@/lib/utils";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Checkbox } from "../ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from "../ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import "react-phone-number-input/style.css";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import PriceInput from "../ui/price-input";
import { RadioGroup } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { ToggleGroup } from "../ui/toggle-group";

const QuillEditor = dynamic(() => import("@/components/ui/quill-editor"), {
  ssr: false,
});

interface BaseCustomProps<TFormValues extends FieldValues> {
  control: Control<TFormValues>;
  fieldType: FormFieldTypes;
  name: Path<TFormValues>;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
  required?: boolean;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  formDescription?: string;
  renderSkeleton?: (
    field: UseControllerReturn<TFormValues>["field"]
  ) => React.ReactNode;
}

interface InputProps<TFormValues extends FieldValues>
  extends BaseCustomProps<TFormValues> {
  fieldType: FormFieldTypes.INPUT;
  inputType?:
    | "text"
    | "password"
    | "email"
    | "number"
    | "tel"
    | "url"
    | "search";
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

interface TextareaProps<TFormValues extends FieldValues>
  extends BaseCustomProps<TFormValues> {
  fieldType: FormFieldTypes.TEXTAREA;
  rows?: number;
  maxLength?: number;
  resizable?: boolean;
}
interface PriceInputProps<TFormValues extends FieldValues>
  extends BaseCustomProps<TFormValues> {
  fieldType: FormFieldTypes.PRICE_INPUT;
  min?: number;
  max?: number;
  inputClassName?: string;
}

export interface MultiSelectProps<TFormValues extends FieldValues>
  extends BaseCustomProps<TFormValues> {
  fieldType: FormFieldTypes.MULTI_SELECT;
  children: React.ReactNode;
  maxSelected?: number;
  searchable?: boolean;
  showSelectedBeneath?: boolean;
  renderSelectedItem?: (value: any, onRemove: () => void) => React.ReactNode;
  onSearch?: (searchTerm: string) => void;
}

interface CommandProps<TFormValues extends FieldValues>
  extends BaseCustomProps<TFormValues> {
  fieldType: FormFieldTypes.COMMAND;
  children: React.ReactNode;
  searchPlaceholder?: string;
  emptyMessage?: string;
  onSearch?: (value: string) => void;
  renderSelectedValue?: (value: any) => React.ReactNode;
}

interface DatePickerProps<TFormValues extends FieldValues>
  extends BaseCustomProps<TFormValues> {
  fieldType: FormFieldTypes.DATE_PICKER;
  trigger?: React.ReactNode;
  dateFormat?: string;
  calendarProps?: {
    mode?: "single" | "multiple" | "range";
    selected?: Date | Date[] | { from: Date; to: Date };
    disabled?: (date: Date) => boolean;
    footer?: React.ReactNode;
    showTimePicker?: boolean;
    timeFormat?: string;
  };
}

interface SelectProps<TFormValues extends FieldValues>
  extends BaseCustomProps<TFormValues> {
  fieldType: FormFieldTypes.SELECT;
  triggerContent?: React.ReactNode;
  children: React.ReactNode;
}

interface CheckboxProps<TFormValues extends FieldValues>
  extends BaseCustomProps<TFormValues> {
  fieldType: FormFieldTypes.CHECKBOX;
  checkboxLabel?: string | React.ReactNode;
}

interface SwitchProps<TFormValues extends FieldValues>
  extends BaseCustomProps<TFormValues> {
  fieldType: FormFieldTypes.SWITCH;
  switchLabel?: string | React.ReactNode;
}

interface RadioGroupProps<TFormValues extends FieldValues>
  extends BaseCustomProps<TFormValues> {
  fieldType: FormFieldTypes.RADIO_GROUP;
  children: React.ReactNode;
}
interface ToggleGroupProps<TFormValues extends FieldValues>
  extends BaseCustomProps<TFormValues> {
  fieldType: FormFieldTypes.TOGGLE_GROUP;
  type: "single" | "multiple";
  children: React.ReactNode;
}

interface ComboboxProps<TFormValues extends FieldValues>
  extends BaseCustomProps<TFormValues> {
  fieldType: FormFieldTypes.COMBOBOX;
  children: React.ReactNode;
}
interface QuillProps<TFormValues extends FieldValues>
  extends BaseCustomProps<TFormValues> {
  fieldType: FormFieldTypes.QUILL;
}
interface FileInputProps<TFormValues extends FieldValues>
  extends BaseCustomProps<TFormValues> {
  fieldType: FormFieldTypes.FILE_INPUT;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onFilesSelected?: (files: File[]) => void;
}
interface PhoneInputProps<TFormValues extends FieldValues>
  extends BaseCustomProps<TFormValues> {
  fieldType: FormFieldTypes.PHONE_INPUT;
  defaultCountry?: string;
  onlyCountries?: string[];
  international?: boolean;
  withCountryCallingCode?: boolean;
}
interface PasswordInputProps<TFormValues extends FieldValues>
  extends BaseCustomProps<TFormValues> {
  fieldType: FormFieldTypes.PASSWORD;
}
interface SkeletonProps<TFormValues extends FieldValues>
  extends BaseCustomProps<TFormValues> {
  fieldType: FormFieldTypes.SKELETON;
}
type CustomProps<TFormValues extends FieldValues> =
  | InputProps<TFormValues>
  | TextareaProps<TFormValues>
  | PhoneInputProps<TFormValues>
  | SkeletonProps<TFormValues>
  | DatePickerProps<TFormValues>
  | SelectProps<TFormValues>
  | CheckboxProps<TFormValues>
  | SwitchProps<TFormValues>
  | RadioGroupProps<TFormValues>
  | ToggleGroupProps<TFormValues>
  | ComboboxProps<TFormValues>
  | FileInputProps<TFormValues>
  | CommandProps<TFormValues>
  | MultiSelectProps<TFormValues>
  | PriceInputProps<TFormValues>
  | QuillProps<TFormValues>
  | PasswordInputProps<TFormValues>;

export const MultiSelectPills = ({
  selected,
  onRemove,
  renderSelectedItem,
}: {
  selected: any[];
  onRemove: (value: any) => void;
  renderSelectedItem?: (value: any, onRemove: () => void) => React.ReactNode;
}) => {
  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {selected.map((value, index) => {
        if (renderSelectedItem) {
          return (
            <div key={index}>
              {renderSelectedItem(value, () => onRemove(value))}
            </div>
          );
        }
        return (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1 text-xs"
          >
            {value.toString()}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onRemove(value);
              }}
              className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
            >
              <X className="size-3" />
              <span className="sr-only">Remove</span>
            </button>
          </Badge>
        );
      })}
    </div>
  );
};

const RenderInput = <TFormValues extends FieldValues>({
  field,
  props,
}: {
  field: any;
  props: CustomProps<TFormValues>;
}) => {
  const { fieldType, iconSrc, iconAlt, placeholder } = props;
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const selected = useMemo(() => field.value || [], [field.value]);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const renderIcon = () => {
    if (!iconSrc) return null;
    return (
      <Image
        src={iconSrc}
        height={24}
        width={24}
        alt={iconAlt || "icon"}
        className="ml-2"
      />
    );
  };

  switch (fieldType) {
    case FormFieldTypes.INPUT: {
      const inputProps = props as InputProps<typeof field.value>;
      return (
        <div className="relative">
          {renderIcon()}
          {inputProps.prefix && (
            <div className="absolute left-3">{inputProps.prefix}</div>
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              disabled={props.disabled}
              {...field}
              className={cn(
                "no-focus h-[51px] rounded-[6px] border border-gray-300 placeholder:text-[15px] placeholder:font-medium placeholder:text-gray-600",
                inputProps.prefix && "pl-10",
                inputProps.suffix && "pr-10",
                props.className
              )}
              type={inputProps.inputType}
            />
          </FormControl>
          {inputProps.suffix && (
            <div className="absolute right-3">{inputProps.suffix}</div>
          )}
        </div>
      );
    }
    case FormFieldTypes.PRICE_INPUT: {
      const inputProps = props as PriceInputProps<typeof field.value>;
      return (
        <div className="relative">
          <FormControl>
            <PriceInput
              {...field}
              min={inputProps.min}
              max={inputProps.max}
              placeholder={placeholder}
              inputClassname={inputProps.inputClassName}
              className={inputProps.className}
              disabled={inputProps.disabled}
            />
          </FormControl>
        </div>
      );
    }

    case FormFieldTypes.MULTI_SELECT: {
      const multiSelectProps = props as MultiSelectProps<typeof field.value>;
      const handleSearch = (value: string) => {
        setSearchTerm(value);
        multiSelectProps.onSearch?.(value);
      };

      const handleRemoveSelection = (value: any) => {
        field.onChange(selected.filter((item: any) => item !== value));
      };

      const getSelectedLabel = () => {
        if (selected.length === 0)
          return props.placeholder || "Select items...";
        return `${selected.length} selected`;
      };

      return (
        <div className="flex flex-col gap-1.5">
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !selected.length && "text-muted-foreground"
                  )}
                >
                  <span className="truncate">{getSelectedLabel()}</span>
                  <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                {multiSelectProps.searchable && (
                  <div className="flex items-center border-b px-3">
                    <Search className="mr-2 size-4 shrink-0 opacity-50" />
                    <Input
                      className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                )}
                <Command className="max-h-[300px] overflow-auto">
                  <CommandGroup>{multiSelectProps.children}</CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>

          {!multiSelectProps.showSelectedBeneath && selected.length > 0 && (
            <MultiSelectPills
              selected={selected}
              onRemove={handleRemoveSelection}
              renderSelectedItem={multiSelectProps.renderSelectedItem}
            />
          )}
        </div>
      );
    }
    case FormFieldTypes.PASSWORD: {
      const passwordProps = props as PasswordInputProps<typeof field.value>;

      return (
        <FormControl>
          <div className="relative flex w-full items-center gap-1 rounded-md bg-transparent p-0">
            {/* {props.label && (
              <Label
                className={cn(
                  "absolute top-0 left-0 mt-[-12px] translate-x-3 bg-white px-2 py-1"
                )}
              >
                {props.label}
              </Label>
            )} */}
            <Input
              disabled={passwordProps.disabled}
              placeholder={placeholder || "Enter your password"}
              type={showPassword ? "text" : "password"}
              className={cn(
                "no-focus 0 h-[54px] rounded-[10px] bg-[#F7F7F7] placeholder:text-sm placeholder:font-light placeholder:text-[#1E1E1E]",
                passwordProps.className
              )}
              {...field}
            />
            <Button
              variant={"ghost"}
              type="button"
              size={"icon"}
              className="absolute top-1/2 right-0 h-fit w-fit -translate-x-4 -translate-y-1/2 cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={passwordProps.disabled}
            >
              {!showPassword ? (
                <EyeIcon
                  className="dark:text-light-500 text-primary size-4 cursor-pointer"
                  aria-hidden
                />
              ) : (
                <EyeOffIcon
                  className="dark:text-light-500 text-primary size-4 cursor-pointer"
                  aria-hidden
                />
              )}
              {/* <span className="sr-only">
          {showPassword ? "Hide password" : "Show password"}
        </span> */}
            </Button>
          </div>
        </FormControl>
      );
    }
    case FormFieldTypes.COMMAND: {
      const commandProps = props as CommandProps<typeof field.value>;

      return (
        <FormControl>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {field.value
                  ? commandProps.renderSelectedValue?.(field.value) ||
                    field.value.toString()
                  : props.placeholder || "Select an option..."}
                <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput
                  placeholder={commandProps.searchPlaceholder || "Search..."}
                  onValueChange={commandProps.onSearch}
                />
                <CommandEmpty>
                  {commandProps.emptyMessage || "No results found."}
                </CommandEmpty>
                {commandProps.children}
              </Command>
            </PopoverContent>
          </Popover>
        </FormControl>
      );
    }
    case FormFieldTypes.TOGGLE_GROUP: {
      const toggleProps = props as ToggleGroupProps<typeof field.value>;
      return (
        <FormControl>
          <ToggleGroup
            type={toggleProps.type}
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={props.disabled}
            className={props.className}
          >
            {toggleProps.children}
          </ToggleGroup>
        </FormControl>
      );
    }
    case FormFieldTypes.DATE_PICKER: {
      const dateProps = props as DatePickerProps<typeof field.value>;
      const parsedDate =
        typeof field.value === "string" ? new Date(field.value) : field.value;

      return (
        <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
          <PopoverTrigger asChild>
            {dateProps.trigger || (
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "h-[51px] w-full cursor-pointer pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={props.disabled}
                >
                  {field.value ? (
                    format(parsedDate, props.dateFormat || "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto size-4 opacity-50" />
                </Button>
              </FormControl>
            )}
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Calendar
              mode={dateProps.calendarProps?.mode || "single"}
              selected={dateProps.calendarProps?.selected || field.value}
              onSelect={(e: any) => {
                setOpenCalendar(false);
                field.onChange(e);
              }}
              captionLayout="dropdown"
              disabled={dateProps.calendarProps?.disabled || props.disabled}
              initialFocus
              {...dateProps.calendarProps}
              {...(dateProps.calendarProps?.mode === "range"
                ? { required: true }
                : {})}
            />
            {dateProps.calendarProps?.footer}
          </PopoverContent>
        </Popover>
      );
    }
    case FormFieldTypes.TEXTAREA: {
      const textareaProps = props as TextareaProps<typeof field.value>;
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            disabled={props.disabled}
            rows={textareaProps.rows}
            maxLength={textareaProps.maxLength}
            className={cn(
              "h-[51px] min-h-32 rounded-[6px] border border-gray-300",
              !textareaProps.resizable && "resize-none",
              props.className
            )}
            {...field}
          />
        </FormControl>
      );
    }
    case FormFieldTypes.QUILL: {
      return (
        <FormControl>
          <QuillEditor
            {...field}
            placeholder={props.placeholder}
            className="dark:light-border-2 dark:text-light-600 rounded-[10px] bg-white p-0 text-base outline-none placeholder:text-sm dark:bg-transparent dark:placeholder:text-white [&_.ql-editor_span]:!bg-transparent [&_p]:bg-transparent [&>.ql-container_.ql-editor]:min-h-[200px]"
          />
        </FormControl>
      );
    }
    case FormFieldTypes.SWITCH: {
      const switchProps = props as SwitchProps<typeof field.value>;
      console.log(field.value);
      return (
        <div className="flex items-center space-x-2">
          <FormControl>
            <Switch
              defaultChecked={field.value}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={props.disabled}
              className={props.className}
            />
          </FormControl>
          {switchProps.switchLabel && (
            <div className="text-sm leading-none font-medium">
              {switchProps.switchLabel}
            </div>
          )}
        </div>
      );
    }
    case FormFieldTypes.RADIO_GROUP: {
      const radioProps = props as RadioGroupProps<typeof field.value>;
      return (
        <FormControl>
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={props.disabled}
            className={props.className}
          >
            {radioProps.children}
          </RadioGroup>
        </FormControl>
      );
    }
    case FormFieldTypes.PHONE_INPUT: {
      const phoneProps = props as PhoneInputProps<typeof field.value>;

      return (
        <FormControl>
          <PhoneInput
            international={phoneProps.international}
            countryCallingCodeEditable={phoneProps.withCountryCallingCode}
            defaultCountry={"NG"}
            onlyCountries={phoneProps.onlyCountries}
            value={field.value as E164Number}
            onChange={(value) => field.onChange(value)}
            disabled={props.disabled}
            className={cn(
              "h-[51px] rounded-[6px] !border border-gray-300 !p-2",
              props.className
            )}
          />
        </FormControl>
      );
    }
    //

    case FormFieldTypes.CHECKBOX: {
      const checkboxProps = props as CheckboxProps<typeof field.value>;

      return (
        <div className="flex items-center gap-4">
          <FormControl>
            <div className="flex items-center gap-2">
              <Checkbox
                id={props.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={props.disabled}
                className={props.className}
              />
              {checkboxProps.checkboxLabel && (
                <div className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {checkboxProps.checkboxLabel}
                </div>
              )}
            </div>
          </FormControl>
        </div>
      );
    }

    case FormFieldTypes.SELECT: {
      const selectProps = props as SelectProps<typeof field.value>;
      return (
        <FormControl>
          <Select
            disabled={props.disabled}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger
                className={cn(
                  "!h-[51px] w-full cursor-pointer rounded-[6px] border border-gray-300",
                  props.className
                )}
              >
                <SelectValue placeholder={props.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="landtana-select-content">
              {selectProps.children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    }

    case FormFieldTypes.SKELETON:
      return props.renderSkeleton ? <>{props.renderSkeleton(field)}</> : null;
    default:
      return null;
  }
};

export const CustomFormField = <TFormValues extends FieldValues>(
  props: CustomProps<TFormValues>
) => {
  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className={cn("flex-1", props.className)}>
          {props.fieldType !== FormFieldTypes.CHECKBOX &&
            props.fieldType !== FormFieldTypes.SWITCH &&
            props.label && (
              <FormLabel
                className={cn("text-[15px] font-normal text-gray-500", {
                  required: props.required,
                })}
              >
                {props.label}{" "}
                {props.required && <span className="required">*</span>}
              </FormLabel>
            )}
          <RenderInput field={field} props={props} />

          {props.formDescription && (
            <FormDescription>{props.formDescription}</FormDescription>
          )}

          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};
