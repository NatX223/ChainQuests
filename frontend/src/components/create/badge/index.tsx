import { ChangeEvent, FC, FocusEvent } from "react";
import { TextAreaField, TextField, NumberField } from "@/components";
import { TimeStamp } from "..";
import "./index.scss";

interface props {
	group: string;
	formData: {
		title: string;
		description: string;
		amount: string;
		startDate: Date;
		endDate: Date | null;
		working: boolean;
		additionalInfo: string;
	};
	handleFormChange: (event: ChangeEvent<any>) => void;
	setFieldValue: (field: string, value: any) => void;
	handleBlur: (event: FocusEvent<any>) => void;
	errors: {
		title?: string;
		description?: string;
		amount?: string;
		additionalInfo?: string;
	};
	touched: {
		title?: boolean;
		description?: boolean;
		amount?: boolean;
		additionalInfo?: boolean;
	};
}

const FormField: FC<props> = ({
	group,
	formData,
	handleFormChange,
	setFieldValue,
	handleBlur,
	errors,
	touched,
}) => {
	const {
		title,
		description,
		amount,
		startDate,
		endDate,
		working,
		additionalInfo,
	} = formData;
	return (
		<>
			{/* Text input for badge title */}
			<TextField
				id="title"
				group={group}
				label="Giveaway Title"
				value={title}
				touched={touched.title}
				onBlur={handleBlur}
				error={errors.title}
				edit={false}
				onChange={handleFormChange}
			/>

			{/* Textarea input for badge description */}
			<TextAreaField
				id="description"
				group={group}
				label="Giveaway Description"
				value={description}
				touched={touched.description}
				onBlur={handleBlur}
				error={errors.description}
				onChange={handleFormChange}
			/>

			<NumberField
				id="amount"
				group={group}
				label="How much do you want to giveaway"
				value={amount}
				touched={touched.amount}
				onBlur={handleBlur}
				error={errors.amount}
				edit={true}
				placeholder="minimum of 1 ETH"
				setFieldValue={setFieldValue}
			/>

			{/* Timestamp component for start and end dates */}
			<TimeStamp
				group={group}
				label="Timestamp"
				startDate={startDate}
				endDate={endDate}
				working={working}
				handleBlur={handleBlur}
				handleFormChange={handleFormChange}
				errors={errors}
				touched={touched}
				placeholder="Still working"
				setFieldValue={setFieldValue}
			/>

			{/* Textarea input for additional information */}
			<TextAreaField
				id="additionalInfo"
				group={group}
				label="Additional information"
				value={additionalInfo}
				touched={touched.additionalInfo}
				onBlur={handleBlur}
				error={errors.additionalInfo}
				onChange={handleFormChange}
			/>
		</>
	);
};

export { FormField as BadgeForm };
