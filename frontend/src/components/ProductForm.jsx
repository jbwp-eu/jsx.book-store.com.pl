import { useEffect, useState } from "react";
import {
  useNavigate,
  useNavigation,
  redirect,
  useSubmit,
} from "react-router-dom";
import { uiActions } from "../slices/uiSlice";
import { useRef } from "react";
import { useFormik } from "formik";
import { object, string, number } from "yup";
import i18n from "../i18n";

const ProductForm = ({ product }) => {
  const navigate = useNavigate();

  const navigation = useNavigation();

  const submit = useSubmit();

  const [file, setFile] = useState("");
  const [previewUrl, setPreviewUrl] = useState(false);

  let formData = new FormData();

  const formik = useFormik({
    initialValues: {
      title: product.title || "",
      description: product.description || "",
      price: product.price || "",
      countInStock: product.countInStock || "",
      category: product.category || "",
      link: product.image || "",
    },

    validationSchema: object({
      title: string().required("Please enter title"),
      description: string().required("Please enter description"),
      price: number()
        .required("Please enter price")
        .positive("Please enter a positive number"),
      countInStock: number()
        .required("Please enter count in stock")
        .min(0, "Please enter a number greater than or equal to 0"),
      category: string().required("Please enter category"),
      link: string(),
    }),

    onSubmit: (values) => {
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("countInStock", values.countInStock);
      formData.append("category", values.category);
      formData.append("link", values.link);
      formData.append("image", file);
      // formData.append('pages', state.pages);

      submit(formData, {
        method: "patch",
        encType: "multipart/form-data",
      });
    },
  });

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();

    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickeHandler = (e) => {
    let pickedFile;
    if (e.target.files || e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      setFile(pickedFile);
    }
  };

  const cancelHandler = () => {
    navigate("..");
  };

  const filePickerRef = useRef();

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const isSubmitting = navigation.state === "submitting";

  return (
    <form onSubmit={formik.handleSubmit}>
      <p>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </p>
      {formik.touched.title && formik.errors.title ? (
        <p className="form-error">{formik.errors.title}</p>
      ) : null}

      <p>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          type="text"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          rows={4}
        />
      </p>
      {formik.touched.description && formik.errors.description ? (
        <p className="form-error">{formik.errors.description}</p>
      ) : null}

      <p>
        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          name="price"
          value={formik.values.price}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </p>
      {formik.touched.price && formik.errors.price ? (
        <p className="form-error">{formik.errors.price}</p>
      ) : null}

      <p>
        <label htmlFor="countInStock">CountInStock</label>
        <input
          id="countInStock"
          type="number"
          name="countInStock"
          value={formik.values.countInStock}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </p>
      {formik.touched.countInStock && formik.errors.countInStock ? (
        <p className="form-error">{formik.errors.countInStock}</p>
      ) : null}

      <p>
        <label htmlFor="category">Category</label>
        <input
          id="category"
          type="string"
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </p>
      {formik.touched.category && formik.errors.category ? (
        <p className="form-error">{formik.errors.category}</p>
      ) : null}

      <p>
        {/* <label htmlFor='image'>Image</label> */}
        <input
          id="image"
          type="file"
          ref={filePickerRef}
          className="visually-hidden"
          onChange={pickeHandler}
          //name="image"
        />
      </p>
      {previewUrl && <img src={previewUrl} alt="Preview" />}
      {!previewUrl && <p>Please pick an image or paste the image link</p>}

      {!previewUrl && (
        <p>
          <label htmlFor="imageLink">Link</label>
          <input
            id="imageLink"
            type="string"
            name="link"
            value={formik.values.link}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </p>
      )}

      <button
        type="button"
        className="button pickImage"
        onClick={pickImageHandler}
      >
        Pick Image
      </button>

      <div className="actions">
        <button
          type="button"
          className="button"
          onClick={cancelHandler}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button type="submit" className="button" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Save"}
        </button>
      </div>
    </form>
  );
};

const action =
  (dispatch, language) =>
  async ({ request, params }) => {
    const method = await request.method;
    const data = await request.formData();

    const { id } = params;

    let url = `${import.meta.env.VITE_BACKEND_URL}/products?language=${language}`;

    if (method === "PATCH") {
      url = `${import.meta.env.VITE_BACKEND_URL}/products/${id}?language=${language}`;
    }

    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: i18n.t("common.sending"),
        message: i18n.t("common.sendingData"),
      }),
    );

    const token = localStorage.getItem("token");

    const response = await fetch(url, {
      method: method,
      headers: {
        Authorization: "Bearer " + token,
      },
      body: data,
    });

    if (!response.ok) {
      const responseData = await response.json();
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: i18n.t("common.error"),
          message: responseData.message,
        }),
      );
      return redirect("/admin/productsList");
    }
    const resData = await response.json();
    dispatch(
      uiActions.showNotification({
        status: "success",
        title: i18n.t("common.success"),
        message: resData.message,
      }),
    );
    return redirect(`/product/${id}`);
  };

ProductForm.action = action;
export default ProductForm;
