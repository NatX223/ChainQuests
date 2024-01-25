import * as Yup from "yup";

/**
 * Validation schema for the Medal form.
 */
export const MEDAL_SCHEMA = Yup.object().shape({
	/**
	 * Image field validation.
	 * Required field.
	 */
	image: Yup.mixed().required("Image is required"),

	/**
	 * Title field validation.
	 * Required field.
	 */
	title: Yup.string().required("Title is required"),

	/**
	 * Address field validation.
	 * Required field.
	 * Must be a valid Ethereum address.
	 */
	address: Yup.string()
		.required("Address is required")
		.matches(/^(0x)?[a-fA-F0-9]{40}$/, "Invalid or incomplete address"),

	/**
	 * Medals field validation.
	 * Required field.
	 * Must be a number.
	 * Maximum allowed value is 75.
	 */
	amount: Yup.number()
		.required("Number of tokens to airdrop is required")
		.min(999, "Minimum number of tokens to create is 1000"),

	/**
	 * AdditionalInfo field validation.
	 * Optional field.
	 */
	additionalInfo: Yup.string().required("Airdrop description is required"),
});
