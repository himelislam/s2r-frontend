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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  endpoint: z.string().url({
    message: "Please enter a valid API endpoint URL",
  }),
  method: z.enum(['GET', 'POST', 'PUT']),
})

export function ApiConfig({ campaignId, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endpoint: "",
      method: "POST",
    },
  })

  const saveApiMutation = useMutation({
    mutationFn: (data) => campaignApi.updateCampaign({
      campaignId,
      updates: {
        'integrations.customApi': {
          endpoint: data.endpoint,
          method: data.method,
          isActive: true,
          headers: {}, // Initialize empty headers
          bodyTemplate: "", // Initialize empty body template
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
    saveApiMutation.mutate(values)
  }

  if (isSuccess) {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Public API Configured</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>API Integration Active</AlertTitle>
            <AlertDescription>
              Referral data will now be sent to your API endpoint.
            </AlertDescription>
          </Alert>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h4 className="font-medium">API Information:</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>Method: {form.getValues('method')}</li>
              <li>Endpoint: {form.getValues('endpoint')}</li>
              <li>Data will be sent as JSON in the request body</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Configure Public API</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Endpoint URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://api.yourdomain.com/referrals"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your API endpoint that will receive referral data
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HTTP Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select HTTP method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    POST recommended for sending referral data
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Activate API Integration"
              )}
            </Button>
          </form>
        </Form>

        <Separator className="my-6" />

        <div className="text-sm text-muted-foreground">
          <h4 className="font-medium mb-2">API Requirements:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your endpoint must accept HTTPS requests</li>
            <li>For POST/PUT, it should accept JSON payloads</li>
            <li>Should return 2xx status code for successful requests</li>
            <li>We'll send referral data in real-time</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}