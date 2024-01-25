import { FC, FocusEvent } from "react";
import {
	TextField,
	TextAreaField,
	NumberField,
	TimeStamp,
} from "@/components";
import "./index.scss";

interface props {
	group: string;
	errors: {
		title?: string;
		address?: string;
		additionalInfo?: string;
		amount?: string;
	};
	touched: {
		title?: boolean;
		address?: boolean;
		additionalInfo?: boolean;
		amount?: boolean;
	};
	formData: {
		title: string;
		address: string;
		amount: string;
		additionalInfo: string;
		startDate: Date;
		endDate: Date | null;
		working: boolean;
	};
	handleBlur: (event: FocusEvent<any>) => void;
	setFieldValue: (
		field: string,
		value: any,
		shouldValidate?: boolean,
	) => void;
	handleFormChange: (event: any) => void;
}

const FormField: FC<props> = ({
	group,
	errors,
	touched,
	formData,
	handleBlur,
	setFieldValue,
	handleFormChange,
}) => {
	const {
		title,
		address,
		amount,
		additionalInfo,
		startDate,
		endDate,
		working,
	} = formData;

	return (
		<>
			{/* Medal Title Field */}
			<TextField
				id="title"
				group={group}
				label="Airdrop Title"
				value={title}
				touched={touched.title}
				onBlur={handleBlur}
				error={errors.title}
				edit={false}
				onChange={handleFormChange}
			/>

			{/* Additional Information Textarea */}
			<TextAreaField
				id="additionalInfo"
				group={group}
				label="Airdrop Description"
				value={additionalInfo}
				touched={touched.additionalInfo}
				onBlur={handleBlur}
				error={errors.additionalInfo}
				onChange={handleFormChange}
			/>

			{/* Contract Address Field */}
			<TextField
				id="address"
				group={group}
				label="Token Address"
				value={address}
				touched={touched.address}
				onBlur={handleBlur}
				error={errors.address}
				edit={true}
				placeholder="0x636h821nb"
				onChange={handleFormChange}
			/>

			{/* Prompts the user to enter the number of medals they want to create */}
			<NumberField
				id="amount"
				group={group}
				label="How many token for the Airdrop"
				value={amount}
				touched={touched.amount}
				onBlur={handleBlur}
				error={errors.amount}
				edit={true}
				placeholder="minimum of 1,000 tokens"
				setFieldValue={setFieldValue}
			/>

			{/* Timestamp component for start and end dates */}
			<TimeStamp
				group={group}
				startDate={startDate}
				endDate={endDate}
				working={working}
				handleBlur={handleBlur}
				handleFormChange={handleFormChange}
				errors={errors}
				touched={touched}
				label="Airdrop duration"
				placeholder="Endless minting"
				setFieldValue={setFieldValue}
			/>
		</>
	);
};

export { FormField as MedalForm };
