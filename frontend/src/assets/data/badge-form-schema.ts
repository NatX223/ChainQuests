import * as yup from "yup";

/**
 * Validation schema for the badge form.
 */
export const BADGE_SCHEMA = yup.object().shape({
	// Validation for badge image field
	image: yup.mixed().required("Giveaway image is required"),

	// Validation for badge title field
	title: yup.string().required("Giveaway title is required"),

	// Validation for badge description field
	description: yup.string().required("Giveaway description is required"),

	amount: yup.number()
	.required("Amount to giveaway is required"),


	// Validation for working status field
	working: yup.boolean(),

	// Validation for start date field
	startDate: yup.date().required("Start date is required"),

	// Validation for end date field
	endDate: yup
		.date()
		.when("startDate", (startDate, schema) => {
			// End date should not be before the start date
			return schema.min(
				startDate,
				"The start date cannot be before the end date",
			);
		})
		.when("working", (working, schema) => {
			// Additional validation for end date if badge is not currently working
			if (!working) {
				return schema
					.min(yup.ref("startDate"))
					.required("End date is required if not currently working");
			}
			return schema;
		}),

	// Validation for additional information field
	additionalInfo: yup.string(),

});
