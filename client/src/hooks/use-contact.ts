import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export function useSubmitContact() {
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  return {
    mutate: (data: any, callbacks: { onSuccess: () => void }) => {
      setIsPending(true);
      setTimeout(() => {
        setIsPending(false);
        toast({
          title: "Inquiry Sent Successfully",
          description: "Thank you for contacting VisLuck. We will get back to you shortly.",
          variant: "default",
        });
        callbacks.onSuccess();
      }, 500);
    },
    isPending,
  };
}
