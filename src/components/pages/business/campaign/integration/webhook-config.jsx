import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useMutation } from "@tanstack/react-query"
import campaignApi from "@/api/campaignApi"
import { toast } from "react-toastify"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  url: z.string().url({
    message: "Please enter a valid URL",
  }),
  method: z.enum(['GET', 'POST', 'PUT']),
})

export function WebhookConfig({ campaignId, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      method: "POST",
    },
  })

  const saveWebhookMutation = useMutation({
    mutationFn: (data) => campaignApi.updateCampaign({
      campaignId,
      updates: {
        'integrations.webhook': {
          url: data.url,
          method: data.method,
          isActive: true,
          headers: {}, // Initialize empty headers
          lastTriggeredAt: null
        }
      }
    }),
    onSuccess: () => {
      setIsSuccess(true)
      onSuccess?.()
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    }
  })

  async function onSubmit(values) {
    setIsLoading(true)
    setError(null)
    saveWebhookMutation.mutate(values)
  }

  if (isSuccess) {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Webhook Connected Successfully</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Ready to receive data!</AlertTitle>
            <AlertDescription>
              Form submissions will now be sent to your webhook URL.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    // <Card className="max-w-2xl">
    //   <CardHeader>
    //     <CardTitle>Configure Webhook</CardTitle>
    //   </CardHeader>
    //   <CardContent>
    //     <Form {...form}>
    //       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    //         <FormField
    //           control={form.control}
    //           name="url"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>Webhook URL</FormLabel>
    //               <FormControl>
    //                 <Input
    //                   placeholder="https://yourdomain.com/webhook"
    //                   {...field}
    //                 />
    //               </FormControl>
    //               <FormDescription>
    //                 The URL where data will be sent
    //               </FormDescription>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         <FormField
    //           control={form.control}
    //           name="method"
    //           render={({ field }) => (
    //             <FormItem>
    //               <FormLabel>HTTP Method</FormLabel>
    //               <Select onValueChange={field.onChange} defaultValue={field.value}>
    //                 <FormControl>
    //                   <SelectTrigger>
    //                     <SelectValue placeholder="Select HTTP method" />
    //                   </SelectTrigger>
    //                 </FormControl>
    //                 <SelectContent>
    //                   <SelectItem value="GET">GET</SelectItem>
    //                   <SelectItem value="POST">POST</SelectItem>
    //                   <SelectItem value="PUT">PUT</SelectItem>
    //                 </SelectContent>
    //               </Select>
    //               <FormMessage />
    //             </FormItem>
    //           )}
    //         />

    //         {error && (
    //           <Alert variant="destructive">
    //             <AlertCircle className="h-4 w-4" />
    //             <AlertTitle>Error</AlertTitle>
    //             <AlertDescription>{error}</AlertDescription>
    //           </Alert>
    //         )}

    //         <Button type="submit" disabled={isLoading}>
    //           {isLoading ? (
    //             <>
    //               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    //               Saving...
    //             </>
    //           ) : (
    //             "Connect Webhook"
    //           )}
    //         </Button>
    //       </form>
    //     </Form>

    //     <Separator className="my-6" />

    //     <div className="text-sm text-muted-foreground">
    //       <h4 className="font-medium mb-2">Webhook Information:</h4>
    //       <ul className="list-disc pl-5 space-y-1">
    //         <li>POST method will send data as JSON in the request body</li>
    //         <li>GET method will append data as query parameters</li>
    //         <li>We'll send referral data in real-time when configured</li>
    //       </ul>
    //     </div>
    //   </CardContent>
    // </Card>

    <Card className="max-w-lg mx-auto mt-6">
      <CardContent className="pt-6 text-center">
        <h2 className="text-xl font-semibold mb-2">
          Webhook integration coming soon
        </h2>
        <p className="text-muted-foreground mb-6">
          We're working on adding this integration soon.
        </p>
        <Button className="bg-blue-500 hover:bg-blue-600">
          Notify me when available
        </Button>
      </CardContent>
    </Card>
  )
}