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
import { useMutation, useQueryClient } from "@tanstack/react-query"
import campaignApi from "@/api/campaignApi"
import integrationApi from "@/api/integrationApi"
import { toast } from "react-toastify"

const formSchema = z.object({
  webhookUrl: z.string().url({
    message: "Please enter a valid Make.com webhook URL",
  }).refine(
    url => url.startsWith("https://hook.eu2.make.com/"),
    {
      message: "Must be a Make webhook URL (starts with https://hook.eu2.make.com/)",
    }
  ),
})

export function MakeConfig({ campaignId, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState(null)
  const queryClient = useQueryClient()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      webhookUrl: "",
    },
  })

  const saveMakeWebhookUrlMutation = useMutation({
    mutationFn: integrationApi.saveMakeURL,
    onSuccess: (data) => {
      setIsSuccess(true)
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    }
  })

  async function onSubmit(values) {

    setIsLoading(true)
    setError(null)
    saveMakeWebhookUrlMutation.mutate({
      campaignId: campaignId,
      makeWebhookUrl: values.webhookUrl,
    })
  }

  const testMakeWebhookUrlMutation = useMutation({
    mutationFn: integrationApi.testMakeURL,
    onSuccess: (data) => {
      console.log(data, 'Success');
      toast.success('Make Test Successfull')
      queryClient.invalidateQueries({
        queryKey: ['getCampaignById'] 
      });
    },
    onError: (err) => {
      console.log(err, 'Error')
    }
  })

  const handleTestMakeWebhookUrl = () => {
    testMakeWebhookUrlMutation.mutate({
      campaignId: campaignId
    })
  }

  if (isSuccess) {
    return (
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Make.com Integration Active</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Successfully Connected!</AlertTitle>
            <AlertDescription>
              Referral data will now be sent to your Make.com scenario.
            </AlertDescription>
          </Alert>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h4 className="font-medium">Next Steps in Make.com:</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li><span onClick={() => handleTestMakeWebhookUrl()} className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium underline hover:no-underline transition-colors">Click Here</span> to send test data</li>
              <li>Complete your scenario setup</li>
              <li>Add modules to process the referral data</li>
              <li>Turn on your scenario</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Connect Make.com</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make.com Webhook URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://hook.make.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Get this from your Make.com webhook module
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
                "Connect Make.com"
              )}
            </Button>
          </form>
        </Form>

        <Separator className="my-6" />

        <div className="text-sm text-muted-foreground">
          <h4 className="font-medium mb-2">Setup Instructions:</h4>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Create a new scenario in Make.com</li>
            <li>Add a "Webhook" module as the first step</li>
            <li>Choose "Custom Webhook" and copy the URL</li>
            <li>Paste it in the field above</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}