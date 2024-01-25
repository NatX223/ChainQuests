import { useFormik } from "formik";
import { BadgeForm, ImageUpload, Rating } from "@/components";
import { BADGE_SCHEMA } from "@/assets/data";
import { mintBadge } from "@/utils/app.mjs";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import "./index.scss";

const useBadgeSubmissionLogic = (values) => {
  const prepareContract = usePrepareContractWrite({
    // Configuration for usePrepareContractWrite
  });

  // Other hooks...
  
  // Return necessary data or functions from the hooks
  return {
    config: prepareContract.config,
    // Other data or functions from hooks
  };
};

export const Badge = ({ group }: { group: string }) => {
  const initialValues = {
    // Define your initial form values
  };

  const { values, handleSubmit, setFieldValue, handleChange, handleBlur, errors, touched } = useFormik({
    validationSchema: BADGE_SCHEMA,
    initialValues,
    onSubmit: async (values) => {
      console.log("Formik data:", values);

      try {
        // Call the custom hook to handle badge submission logic
        const { config } = useBadgeSubmissionLogic(values);

        // Handle logic using data from the custom hook
        // For example, using config...
        
        if (/* isSuccess based on your logic */) {
          await mintBadge(values);
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  // Your JSX for the form and other components...
};
