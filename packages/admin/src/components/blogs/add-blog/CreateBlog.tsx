import { Box, Breadcrumb, Icon, Select, Text } from "@chakra-ui/react";
import React, { useEffect, useId, useState } from "react";
import { useGetAllCategories } from "../../../queries/useCategoryQuery";
import { CategoryProps } from "../../../model/category.model";
import { Editor } from "@tinymce/tinymce-react";
import Button from "../../shared/Button";
import BreadCrumsList from "../../shared/BreadCrumsList";
import FormControl from "../../shared/FormControl";
import Input from "../../shared/Input";
import useFormValidation from "../../../hooks/useFormValidation";
import {
  createBlogFormInitialState,
  validationRules,
} from "../../../helper/createBlogForm.helper";
import { useCreateBlog, useUpdateBlog } from "../../../queries/useBlogsQuery";
import Loading from "../../shared/Loading";
import { useLocation } from "react-router-dom";
import useShowToast from "../../../hooks/useShowToast";

const CreateBlog = () => {
  const [categoryList, setCategoryList] = useState<CategoryProps[]>();
  const [blogId, setBlogId] = useState<string>("");
  const location = useLocation();
  const showToast = useShowToast();
  const blogListItem: BlogListState = location.state?.blogData;

  const { formData, formErrors, handleChange, handleSubmit, isFormValid } =
    useFormValidation(createBlogFormInitialState, validationRules);

  const { data } = useGetAllCategories();
  const {
    mutate,
    data: saveData,
    isSuccess: saveSuccess,
    isLoading: saveLoading,
  } = useCreateBlog();
  const {
    mutate: updateMutate,
    data: updateData,
    isSuccess: updateSuccess,
    isLoading: updateLoading,
  } = useUpdateBlog();

  useEffect(() => {
    if (blogListItem) {
      setBlogId(blogListItem._id);
      handleChange("heading", blogListItem.heading);
      handleChange("description", blogListItem.description);
      handleChange("content", blogListItem.content);
      handleChange("categoryId", blogListItem.categoryId);
    }
    handleChange("userId", "nill");
  }, []);

  useEffect(() => {
    if (data) {
      setCategoryList(data);
    }
    if (saveSuccess && saveData) {
      setBlogId(saveData._id);
      showToast("success", { message: "Saved successfully" });
    }

    if (updateSuccess && updateData) {
      showToast("success", { message: "Updated successfully" });
    }
  }, [data, saveData, saveSuccess, updateSuccess, updateData]);

  const validation = () => {
    if (isFormValid()) {
      blogId === ""
        ? mutate(formData as SaveBlogProps)
        : updateMutate({ id: blogId, body: formData as SaveBlogProps });
    }
  };

  return (
    <Box mt={"2rem"} overflowY={"auto"} px={"0.7rem"} position={"relative"}>
      {updateLoading || saveLoading ? <Loading /> : null}
      <BreadCrumsList />
      <Box
        display={"flex"}
        flexDirection={"column"}
        gap={3}
        alignItems={"center"}
        mt={"1rem"}
      >
        <Box display={"flex"} gap={4} transition={"0.5s ease-in-out"} w="full">
          <FormControl
            label="Heading"
            gap={1}
            flex={1}
            display="flex"
            flexDirection="column"
            isInvalid={!!formErrors.heading}
            errorMsg={formErrors.heading}
          >
            <Input
              placeholder="Heading"
              value={formData.heading}
              onChange={(event) => handleChange("heading", event.target.value)}
            />
          </FormControl>
          <FormControl
            label="Descirption"
            gap={1}
            flex={1}
            display="flex"
            flexDirection="column"
            isInvalid={!!formErrors.description}
            errorMsg={formErrors.description}
          >
            <Input
              placeholder="Description"
              value={formData.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
            />
          </FormControl>
        </Box>
        <FormControl
          label="Category"
          gap={1}
          flex={1}
          display="flex"
          flexDirection="column"
          isInvalid={!!formErrors.categoryId}
          errorMsg={formErrors.categoryId}
        >
          <Select
            placeholder="Select option"
            _focusVisible={{ outline: "none" }}
            onChange={(event) => handleChange("categoryId", event.target.value)}
            fontSize={"sm"}
            value={formData.categoryId}
          >
            {categoryList?.map((item, index) => {
              return (
                <option key={"categorySelect" + index} value={item._id}>
                  {item.name}
                </option>
              );
            })}
          </Select>
        </FormControl>
      </Box>

      <Box mt={"1rem"} display={"flex"} flexDirection={"column"} pb={"2rem"}>
        <Editor
          apiKey={import.meta.env.VITE_EDITOR_KEY}
          init={{
            menubar: false,
            warning_ignored: true,
            branding: false,
            toolbar:
              "undo redo | blocks fontfamily fontsize | forecolor backcolor| bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
            min_height: 100,
            max_height: 300,
          }}
          value={formData.content}
          onEditorChange={(e) => handleChange("content", e)}
        />

        <Button
          alignSelf={"flex-end"}
          mt={"1rem"}
          onClick={() => {
            handleSubmit();
            validation();
          }}
        >
          {blogId === "" ? "Save" : "Update"}
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(CreateBlog);
