"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LOCAL_STORAGE_KEY } from "@/constants/local-storage-key";
import { Wallet, WalletType } from "@/interfaces/wallet.interface";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  address: z.string().min(42).max(42),
  type: z.nativeEnum(WalletType),
});

interface SubscribeWalletDialogProps {
  fetchBalance: () => void;
}

const SubscribeWalletDialog = ({
  fetchBalance,
}: SubscribeWalletDialogProps) => {
  const { toast } = useToast();
  const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const wallets = localStorage.getItem(LOCAL_STORAGE_KEY.WALLET);

    const wallet = JSON.parse(wallets || "[]");

    //   Check if the wallet already exists
    if (wallet.find((w: Wallet) => w.address === values.address)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Wallet already exists",
      });
      return;
    }

    wallet.push({
      name: values.name,
      address: values.address,
      type: values.type,
    });

    localStorage.setItem(LOCAL_STORAGE_KEY.WALLET, JSON.stringify(wallet));

    setSubscribeDialogOpen(false);
    fetchBalance();
    toast({
      variant: "default",
      title: "Success",
      description: "Wallet added successfully",
    });
  }

  return (
    <Dialog open={subscribeDialogOpen} onOpenChange={setSubscribeDialogOpen}>
      <DialogTrigger asChild>
        <Button>🚀 Subscribe wallet</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subscribe to a wallet</DialogTitle>
          <DialogDescription>
            Subscribe to a wallet to display its information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet name</FormLabel>
                  <FormControl>
                    <Input placeholder="Admin wallet #1" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet address</FormLabel>
                  <FormControl>
                    <Input placeholder="0x96..." {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your wallet address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a wallet type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(WalletType).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    You can manage your wallet types.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SubscribeWalletDialog;
