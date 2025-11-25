import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pencil, PlusIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormFieldTypes } from "@/config/enum";
import QuestionIcon from "@/icons/question";
import {
  useAddHealthTracker,
  useUpdateHealthTracker,
} from "@/lib/queries/use-caregiver-query";
import {
  AddHealthVitalSchema,
  AddHealthVitalsType,
} from "@/lib/schemas/user.schema";

import { CustomFormField } from "../shared/custom-form-field";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Form } from "../ui/form";
import { SelectItem } from "../ui/select";

type Props = {
  dialogTrigger: React.ReactNode;
  edit?: boolean;
  data?: {
    id: number;
    name: string;
    value: string;
  };
  caregiver_id: number;
  user_id: number;
  metrics: {
    id: number;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
  }[];
  health_record_id?: number;
};

export default function AddHealthVitals({
  dialogTrigger,
  edit,
  data,
  caregiver_id,
  health_record_id,
  user_id,
  metrics,
}: Props) {
  const [openDialog, setOpenDialog] = useState(false);
  const pathname = usePathname();
  const form = useForm<AddHealthVitalsType>({
    resolver: zodResolver(AddHealthVitalSchema),
    defaultValues: {
      name: data?.name || "",
      value: data?.value || "",
    },
  });

  const { isPending: AddingHealthTracker, mutateAsync: AddHealthTracker } =
    useAddHealthTracker();
  const { isPending: UpdatingHealthTracker, mutateAsync: UpdateHealthTracker } =
    useUpdateHealthTracker();

  const handleSubmit = async (dataValues: AddHealthVitalsType) => {
    if (edit) {
      UpdateHealthTracker(
        {
          valued: {
            [dataValues.name]: dataValues.value,
            caregiver_id,
            user_id,
            id: data?.id ?? 0,
            health_record_id: health_record_id || 0,
          },
          pathname,
        },
        {
          onSuccess: (data) => {
            form.reset();
            toast.success(data.message);
            setOpenDialog(false);
          },
        }
      );
    } else {
      AddHealthTracker(
        {
          valued: {
            [dataValues.name]: dataValues.value,
            caregiver_id,
            health_record_id: health_record_id || 0,
            user_id,
          },
          pathname,
        },
        {
          onSuccess: (data) => {
            toast.success(data.message);
            setOpenDialog(false);
          },
        }
      );
    }
  };
  // Helper function for vital sign details
  // Enhanced helper function for vital sign details
  const getVitalSignDetails = (vitalType: string) => {
    switch (vitalType) {
      // Blood Pressure
      case "blood_pressure":
        return {
          description: "Enter as systolic/diastolic",
          placeholder: "120/80",
          example: "120/80 mmHg",
        };

      // Blood Glucose
      case "blood_glucose_fasting":
        return {
          description: "Enter fasting blood glucose level",
          placeholder: "90",
          example: "70-100 mg/dL",
        };
      case "blood_glucose_random":
        return {
          description: "Enter random blood glucose level",
          placeholder: "120",
          example: "<140 mg/dL",
        };

      // Heart Rate & Pulse
      case "heart_rate":
      case "pulse":
        return {
          description: "Enter heart rate in beats per minute",
          placeholder: "72",
          example: "60-100 bpm",
        };

      // Weight & BMI
      case "weight":
        return {
          description: "Enter weight in kg or lbs",
          placeholder: "70.5",
          example: "70.5 kg or 155 lbs",
        };
      case "bmi":
        return {
          description: "Enter Body Mass Index",
          placeholder: "22.5",
          example: "18.5-24.9",
        };

      // Temperature
      case "temperature":
        return {
          description: "Enter body temperature",
          placeholder: "98.6",
          example: "98.6°F or 37°C",
        };

      // Respiratory
      case "respiration_rate":
        return {
          description: "Enter breathing rate per minute",
          placeholder: "16",
          example: "12-20 breaths/min",
        };
      case "oxygen_saturation":
        return {
          description: "Enter oxygen saturation percentage",
          placeholder: "98",
          example: "95-100%",
        };
      case "peak_flow":
        return {
          description: "Enter peak expiratory flow rate",
          placeholder: "400",
          example: "400-600 L/min",
        };

      // Cholesterol
      case "cholesterol_total":
        return {
          description: "Enter total cholesterol level",
          placeholder: "180",
          example: "<200 mg/dL",
        };
      case "cholesterol_hdl":
        return {
          description: "Enter HDL (good) cholesterol level",
          placeholder: "50",
          example: ">40 mg/dL (men), >50 mg/dL (women)",
        };
      case "cholesterol_ldl":
        return {
          description: "Enter LDL (bad) cholesterol level",
          placeholder: "100",
          example: "<100 mg/dL",
        };
      case "triglycerides":
        return {
          description: "Enter triglycerides level",
          placeholder: "120",
          example: "<150 mg/dL",
        };

      // Diabetes
      case "hba1c":
        return {
          description: "Enter HbA1c percentage",
          placeholder: "5.5",
          example: "<5.7% (normal)",
        };

      // Kidney Function
      case "creatinine":
        return {
          description: "Enter serum creatinine level",
          placeholder: "1.0",
          example: "0.6-1.2 mg/dL",
        };
      case "bun":
        return {
          description: "Enter blood urea nitrogen level",
          placeholder: "15",
          example: "7-20 mg/dL",
        };
      case "egfr":
        return {
          description: "Enter estimated glomerular filtration rate",
          placeholder: "90",
          example: ">60 mL/min/1.73m²",
        };

      // Electrolytes
      case "sodium":
        return {
          description: "Enter sodium level",
          placeholder: "140",
          example: "135-145 mEq/L",
        };
      case "potassium":
        return {
          description: "Enter potassium level",
          placeholder: "4.0",
          example: "3.5-5.0 mEq/L",
        };
      case "chloride":
        return {
          description: "Enter chloride level",
          placeholder: "100",
          example: "96-106 mEq/L",
        };
      case "calcium":
        return {
          description: "Enter calcium level",
          placeholder: "9.5",
          example: "8.5-10.5 mg/dL",
        };

      // Liver Function
      case "alt":
        return {
          description: "Enter ALT (SGPT) level",
          placeholder: "25",
          example: "7-35 U/L",
        };
      case "ast":
        return {
          description: "Enter AST (SGOT) level",
          placeholder: "30",
          example: "8-40 U/L",
        };
      case "bilirubin":
        return {
          description: "Enter bilirubin level",
          placeholder: "0.8",
          example: "0.2-1.2 mg/dL",
        };

      // Thyroid
      case "tsh":
        return {
          description: "Enter TSH level",
          placeholder: "2.5",
          example: "0.4-4.0 mIU/L",
        };
      case "free_t4":
        return {
          description: "Enter Free T4 level",
          placeholder: "1.2",
          example: "0.8-1.8 ng/dL",
        };

      // Vitamins & Minerals
      case "vitamin_d":
        return {
          description: "Enter Vitamin D level",
          placeholder: "30",
          example: "30-100 ng/mL",
        };
      case "iron":
        return {
          description: "Enter iron level",
          placeholder: "100",
          example: "60-170 μg/dL",
        };
      case "ferritin":
        return {
          description: "Enter ferritin level",
          placeholder: "100",
          example: "12-300 ng/mL",
        };

      // Blood Count
      case "hemoglobin":
        return {
          description: "Enter hemoglobin level",
          placeholder: "14.0",
          example: "12-16 g/dL (women), 14-18 g/dL (men)",
        };
      case "hematocrit":
        return {
          description: "Enter hematocrit percentage",
          placeholder: "42",
          example: "36-46% (women), 41-50% (men)",
        };
      case "platelets":
        return {
          description: "Enter platelet count",
          placeholder: "250000",
          example: "150,000-450,000/μL",
        };

      // Inflammatory Markers
      case "crp":
        return {
          description: "Enter C-Reactive Protein level",
          placeholder: "1.0",
          example: "<3.0 mg/L",
        };
      case "esr":
        return {
          description: "Enter Erythrocyte Sedimentation Rate",
          placeholder: "10",
          example: "<30 mm/hr",
        };

      default:
        return {
          description: "Enter the measurement value",
          placeholder: "Enter value",
          example: "Please consult with healthcare provider for normal ranges",
        };
    }
  };
  // In your component
  const selectedVitalType = form.watch("name");
  const vitalDetails = getVitalSignDetails(selectedVitalType);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger className="">
        {/* Trigger button to open the dialog */}
        {dialogTrigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Health Vitals</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <CustomFormField
              control={form.control}
              name="name"
              label="Name"
              fieldType={FormFieldTypes.SELECT}
              // disabled={isPending}
              placeholder="Blood Pressure"
            >
              {metrics.map((met) => (
                <SelectItem
                  key={met.id}
                  value={met.code}
                  className="mb-2 cursor-pointer"
                >
                  {met.name}
                </SelectItem>
              ))}
            </CustomFormField>
            <CustomFormField
              control={form.control}
              name="value"
              label="Value"
              fieldType={FormFieldTypes.INPUT}
              className="placeholder:text-xs"
              inputType="text"
              placeholder={vitalDetails.placeholder}
              formDescription={
                selectedVitalType
                  ? `${vitalDetails.description}. Example: ${vitalDetails.example}`
                  : "Please select a measurement type first"
              }
            />

            <DialogFooter>
              <div className="flex w-full items-center justify-between">
                <QuestionIcon />
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant={"outline"}
                    className="btn btn-secondary !h-[45px] text-sm"
                    onClick={() => setOpenDialog(false)}
                    disabled={AddingHealthTracker || UpdatingHealthTracker}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="btn btn-primary flex !h-[45px] items-center text-sm"
                    disabled={AddingHealthTracker || UpdatingHealthTracker}
                  >
                    {(AddingHealthTracker || UpdatingHealthTracker) && (
                      <Loader2 className="me-2 size-4 animate-spin" />
                    )}
                    {edit ? (
                      <Pencil className="h-4 w-4" />
                    ) : (
                      <PlusIcon className="h-4 w-4" />
                    )}
                    {edit ? "Edit" : "Save"}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
