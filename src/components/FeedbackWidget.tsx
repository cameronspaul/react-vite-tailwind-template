import { useState } from 'react';
import { useMutation } from 'convex/react';
import { useLocation } from 'react-router-dom';
import { api } from '../../convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { MessageSquarePlus, Bug, Lightbulb, Sparkles, HelpCircle } from 'lucide-react';
import { usePostHogAnalytics } from '@/hooks/usePostHogAnalytics';

type FeedbackType = 'bug' | 'feature' | 'improvement' | 'other';

const TYPES: Record<FeedbackType, { label: string; icon: React.ReactNode; placeholder: string }> = {
    bug: { label: 'Bug Report', icon: <Bug className="h-4 w-4 text-red-500" />, placeholder: "Describe the bug. What happened vs what you expected?" },
    feature: { label: 'Feature Request', icon: <Lightbulb className="h-4 w-4 text-yellow-500" />, placeholder: "What feature would help you? How would you use it?" },
    improvement: { label: 'Improvement', icon: <Sparkles className="h-4 w-4 text-blue-500" />, placeholder: "What could we do better?" },
    other: { label: 'Other', icon: <HelpCircle className="h-4 w-4 text-muted-foreground" />, placeholder: "Share your thoughts..." },
};

export function FeedbackWidget() {
    const { pathname } = useLocation();
    const submit = useMutation(api.feedback.submitFeedback);
    const { capture } = usePostHogAnalytics();
    const [type, setType] = useState<FeedbackType>('feature');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const text = message.trim();
        if (!text) return toast.error('Please enter your feedback');
        if (text.length < 10) return toast.error('Please provide more detail (min 10 chars)');

        setSending(true);
        capture('feedback_submitted', { type, length: text.length });
        try {
            await submit({ type, message: text, page: pathname });
            toast.success('Thank you!', { description: "We'll review your feedback." });
            setMessage('');
            setType('feature');
        } catch (err) {
            capture('feedback_error', { error: String(err) });
            toast.error('Failed to submit', { description: 'Please try again.' });
        } finally {
            setSending(false);
        }
    };

    return (
        <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <MessageSquarePlus className="h-5 w-5 text-primary" />
                    Send Feedback
                </CardTitle>
                <CardDescription>Share your thoughts, report bugs, or request features</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fb-type">Feedback type</Label>
                        <Select value={type} onValueChange={(v) => setType(v as FeedbackType)}>
                            <SelectTrigger id="fb-type"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {(Object.entries(TYPES) as [FeedbackType, typeof TYPES[FeedbackType]][]).map(([k, v]) => (
                                    <SelectItem key={k} value={k}>
                                        <span className="flex items-center gap-2">{v.icon}{v.label}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fb-msg">Your feedback</Label>
                        <Textarea
                            id="fb-msg"
                            placeholder={TYPES[type].placeholder}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">{message.length}/500</p>
                    </div>
                    <Button type="submit" className="w-full" disabled={sending || !message.trim()}>
                        {sending ? 'Sending...' : 'Send Feedback'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
