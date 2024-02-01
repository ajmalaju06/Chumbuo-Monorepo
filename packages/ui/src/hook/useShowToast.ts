import { useToast, UseToastOptions } from "@chakra-ui/react";

function useShowToast(props?: UseToastOptions) {
  const toast = useToast(props);

  const showToast = (
    status: Exclude<UseToastOptions["status"], undefined>,
    { message, title }: { message: string; title?: string }
  ) => {
    toast.closeAll();
    toast({
      title: title || status.slice(0, 1).toUpperCase() + status.slice(1),
      description: message,
      status,
      duration: 3000,
      position: "top",
      variant: "solid",
      isClosable: true,
    });
  };
  return showToast;
}

export default useShowToast;
