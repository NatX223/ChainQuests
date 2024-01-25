import { BADGE_SCHEMA } from "@/assets/data";
import { BadgeForm, ImageUpload } from "@/components";
import { useFormik } from "formik";
import "./index.scss";

export const Badge = ({ group }: { group: string }) => {
	const initialValues = {
		additionalInfo: "",
		amount: "0",
		description: "",
		endDate: null,
		image: null,
		rating: 0,
		receiver: "",
		startDate: new Date(),
		title: "",
		validator: "",
		working: false,
	};

	const {
		values,
		handleSubmit,
		setFieldValue,
		handleChange,
		handleBlur,
		errors,
		touched,
	} = useFormik({
		validationSchema: BADGE_SCHEMA,
		initialValues,
		onSubmit: async (values) => {
			console.log("Formik data:", values);
			// Handle form submission logic here (e.g., API call)
		},
	});

	return (
		<section>
			<form
				onSubmit={handleSubmit}
				autoComplete="off"
				className={`${group}__form`}
			>
				{/* Image Upload Component */}
				<ImageUpload
					onImageChange={(image) => setFieldValue("image", image)}
					handleBlur={handleBlur}
					errors={errors}
					touched={touched}
					group="badge"
				/>

				{/* Badge Form Fields */}
				<BadgeForm
					formData={values}
					handleFormChange={handleChange}
					setFieldValue={setFieldValue}
					handleBlur={handleBlur}
					errors={errors}
					touched={touched}
					group="badge"
				/>

				{/* Badge Submission Button */}
				<div className="badge__submit">
					<button
						className="badge__submit-button"
						type="submit"
					>
						<span>Launch Giveaway</span>
					</button>
				</div>
			</form>
		</section>
	);
};
