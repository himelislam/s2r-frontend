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
import integrationApi from "@/api/integrationApi"
import { toast } from "react-toastify"

// Form validation schema
const formSchema = z.object({
    webhookUrl: z.string().url({
        message: "Please enter a valid URL",
    }).refine(
        url => url.startsWith("https://hooks.zapier.com/"),
        {
            message: "Must be a Zapier webhook URL (starts with https://hooks.zapier.com/)",
        }
    ),
})

export function ZapierConfig({ campaignId }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState(null)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            webhookUrl: "",
        },
    })

    const saveZapierWebhookUrlMutation = useMutation({
        mutationFn: integrationApi.saveZapierURL,
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
        saveZapierWebhookUrlMutation.mutate({
            campaignId: campaignId,
            zapierWebhookUrl: values.webhookUrl,
        })
    }

    const testZapierWebhookUrlMutation = useMutation({
        mutationFn: integrationApi.testZapierURL,
        onSuccess: (data) => {
            console.log(data, 'Success');
            toast.success('Zapier Test Successfull')
            
        },
        onError: (err) => {
            console.log(err, 'Error')
        }
    })

    const handleTestZapierWebhookUrl = () => {
        testZapierWebhookUrlMutation.mutate({
            campaignId: campaignId
        })
    }

    if (isSuccess) {
        return (
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Zapier Connected Successfully</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert variant="success">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertTitle>Ready to receive data!</AlertTitle>
                        <AlertDescription>
                            Form submissions will now be sent to your Zapier webhook.
                        </AlertDescription>
                    </Alert>

                    <Separator className="my-6" />

                    <div className="space-y-4">

                        <h4 className="font-medium">Next steps in Zapier:</h4>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li><span onClick={() => handleTestZapierWebhookUrl()}>Click Here</span> to send test data</li>
                            <li>Continue setting up your Zap</li>
                            <li>Choose an action app (Google Sheets, Slack, etc.)</li>
                            <li>Test your Zap to verify data flow</li>
                            <li>Turn on your Zap when ready</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="max-w-2xl">
            <CardHeader>
                <CardTitle>Connect Zapier</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="webhookUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Zapier Webhook URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://hooks.zapier.com/hooks/catch/..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Get this from Zapier when setting up a "Catch Hook" trigger
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
                                "Connect Zapier"
                            )}
                        </Button>
                    </form>
                </Form>

                <Separator className="my-6" />

                <div className="text-sm text-muted-foreground">
                    <h4 className="font-medium mb-2">How to get your webhook URL:</h4>
                    <ol className="list-decimal pl-5 space-y-1">
                        <li>In Zapier, click <strong>"Make a Zap"</strong></li>
                        <li>Search for and select <strong>"Webhooks by Zapier"</strong></li>
                        <li>Choose <strong>"Catch Hook"</strong> as the trigger</li>
                        <li>Copy the generated webhook URL</li>
                    </ol>
                </div>
            </CardContent>
        </Card>
    )
}