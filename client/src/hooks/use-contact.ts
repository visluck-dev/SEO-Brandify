import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { sendContactEmail, ContactFormData } from "@/lib/emailjs";

export function useSubmitContact() {
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  return {
    mutate: async (data: ContactFormData, callbacks: { onSuccess: () => void; onError?: (error: Error) => void }) => {
      setIsPending(true);
      try {
        await sendContactEmail(data);
        toast({
          title: "Inquiry Sent Successfully",
          description: "Thank you for contacting VisLuck. We will get back to you shortly.",
          variant: "default",
        });
        callbacks.onSuccess();
      } catch (error) {
        console.error("Failed to send contact form:", error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again later.",
          variant: "destructive",
        });
        if (callbacks.onError) {
          callbacks.onError(error as Error);
        }
      } finally {
        setIsPending(false);
      }
    },
    isPending,
  };
}
