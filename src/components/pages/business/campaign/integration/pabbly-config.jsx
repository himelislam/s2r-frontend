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

const formSchema = z.object({
  webhookUrl: z.string().url({
    message: "Please enter a valid Pabbly Connect webhook URL",
  }),
})

export function PabblyConfig({ campaignId, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      webhookUrl: "",
    },
  })

  const savePabblyMutation = useMutation({
    mutationFn: (data) => campaignApi.updateCampaign({
      campaignId,
      updates: {
        'integrations.pabbly': {
          webhookUrl: data.webhookUrl,
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
    savePabblyMutation.mutate(values)
  }

  if (isSuccess) {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Pabbly Connect Setup Complete</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Connection Successful!</AlertTitle>
            <AlertDescription>
              Your referral data will now be sent to Pabbly Connect.
            </AlertDescription>
          </Alert>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h4 className="font-medium">Next Steps:</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Set up your workflow in Pabbly Connect</li>
              <li>Configure your desired actions (email, CRM, etc.)</li>
              <li>Test the connection with a real referral</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Connect Pabbly</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pabbly Webhook URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://connect.pabbly.com/workflow/..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Get this from your Pabbly Connect workflow
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
                  Connecting...
                </>
              ) : (
                "Connect Pabbly"
              )}
            </Button>
          </form>
        </Form>

        <Separator className="my-6" />

        <div className="text-sm text-muted-foreground">
          <h4 className="font-medium mb-2">How to get your webhook URL:</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Create a new workflow in Pabbly Connect</li>
            <li>Add a "Webhook" trigger step</li>
            <li>Copy the webhook URL from the trigger settings</li>
            <li>Paste it in the field above</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}