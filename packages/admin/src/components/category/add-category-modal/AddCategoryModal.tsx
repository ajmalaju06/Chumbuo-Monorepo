import React, { useEffect, useState } from "react";
import Modal from "../../shared/Modal";
import { Box } from "@chakra-ui/react";
import Input from "../../shared/Input";
import Button from "../../shared/Button";
import { BTN_VARIANT } from "../../../model/button.enum";
import { useCreatecategory } from "../../../queries/useCategoryQuery";
import useShowToast from "../../../hooks/useShowToast";
import { useQueryClient } from "react-query";
import { GET_ALL_CATEGORIES } from "../../../../constants";

interface AddCategoryModalProps {
  isModalOpen: boolean;
  handleClose: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isModalOpen,
  handleClose,
}) => {
  const [categoryName, setCategoryName] = useState<string>("");
  const showToast = useShowToast();
  const queryClient = useQueryClient();

  const {
    data,
    mutate,
    isLoading: categorySaveLoading,
    isSuccess,
  } = useCreatecategory();

  useEffect(() => {
    if (isSuccess) {
      if (data.error != null) {
        showToast("error", { message: data.error });
      } else {
        setCategoryName("");
        handleClose();
        queryClient.invalidateQueries(GET_ALL_CATEGORIES);
      }
    }
  }, [isSuccess, data]);

  const validateForm = () => {
    if (categoryName !== "") {
      mutate({ name: categoryName });
    } else {
      showToast("error", { message: "Please fill category name" });
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={() => {
        setCategoryName("");
        handleClose();
      }}
      heading="Add Category"
    >
      <Box display={"flex"} flexDirection={"column"} py={"1rem"} gap={5}>
        <Input
          placeholder="Category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <Box display={"flex"} justifyContent={"flex-end"} gap={4}>
          <Button
            btnVariant={BTN_VARIANT.ERROR}
            onClick={() => {
              setCategoryName("");
              handleClose();
            }}
          >
            Cancel
          </Button>
          <Button
            isLoading={categorySaveLoading}
            btnVariant={BTN_VARIANT.SUCCESS}
            onClick={() => validateForm()}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default React.memo(AddCategoryModal);
