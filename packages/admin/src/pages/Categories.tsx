import React, { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import {
  useDeleteCategory,
  useGetAllCategories,
} from "../queries/useCategoryQuery";
import { CategoryProps } from "../model/category.model";
import NoData from "../components/shared/NoData";
import Button from "../components/shared/Button";
import Input from "../components/shared/Input";
import CategoryList from "../components/category/categoryList.tsx/CategoryList";
import AddCategoryModal from "../components/category/add-category-modal/AddCategoryModal";
import { useQueryClient } from "react-query";
import { GET_ALL_CATEGORIES } from "../../constants";
import Loading from "../components/shared/Loading";
import AlertModal from "../components/shared/AlertModal";

const Categories = () => {
  const [categoryList, setCategoryList] = useState<CategoryProps[]>();
  const [filteredList, setFilteredList] = useState<CategoryProps[]>();
  const [searchValue, setSearchValue] = useState<string>("");
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] =
    useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetAllCategories();
  const {
    mutate,
    isSuccess: isDeleteSuccess,
    isLoading: deleteLoading,
  } = useDeleteCategory();

  useEffect(() => {
    if (data) {
      setCategoryList(data);
      setFilteredList(data);
    }
  }, [data]);

  const showAlertModal = (id: string) => {
    setIsAlertOpen(true);
    setDeleteId(id);
  };

  const closeAlertModal = () => {
    setIsAlertOpen(false);
  };

  useEffect(() => {
    if (isDeleteSuccess) {
      closeAlertModal();
      queryClient.invalidateQueries(GET_ALL_CATEGORIES);
    }
  }, [isDeleteSuccess]);

  const closeModal = () => {
    setIsAddCategoryModalOpen(false);
  };

  const handleSearch = (searchVal: string) => {
    setSearchValue(searchVal);
    const filtered = categoryList?.filter((item) =>
      item.name.toLowerCase().includes(searchVal.toLowerCase())
    );
    setFilteredList(filtered);
  };

  return (
    <Box
      px={"4rem"}
      py={"4.3rem"}
      w="full"
      h="full"
      display={"flex"}
      flexDirection={"column"}
      flex={1}
      position={"relative"}
    >
      <Text fontSize={"2xl"} fontWeight={"bold"}>
        Categories
      </Text>

      <Box display={"flex"} alignItems={"center"} gap={5} mt={"2rem"}>
        <Input
          placeholder="Search"
          flex={1}
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button onClick={() => setIsAddCategoryModalOpen(true)}>Add new</Button>
      </Box>

      {isLoading && <Loading />}

      {filteredList && filteredList?.length === 0 && (
        <NoData heading="No records" />
      )}

      <CategoryList categoryList={filteredList} handleDelete={showAlertModal} />

      <AddCategoryModal
        isModalOpen={isAddCategoryModalOpen}
        handleClose={closeModal}
      />

      <AlertModal
        isAlertOpen={isAlertOpen}
        handleCloseAlert={closeAlertModal}
        heading="Do you want to delete?"
        handlePrimaryBtnClick={() => mutate(deleteId)}
        isLoading={deleteLoading}
      />
    </Box>
  );
};

export default React.memo(Categories);
