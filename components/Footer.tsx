"use client"

import { BookOpen } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function Footer() {
    return (
        <footer className="w-full border-t py-8 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                    {/* Brand Section */}
                    <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <span className="font-medium text-lg">
                                solve<span className="text-primary">IIT</span>
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Your one-stop platform for JEE preparation.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            © 2026 rights reserved.
                        </p>
                    </div>

                    {/* Right Side: Contact */}
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="link" className="text-md font-medium text-black hover:text-black/80 transition-colors p-0 h-auto">
                                    Contact Us
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Contact Us</DialogTitle>
                                    <DialogDescription>
                                        We'd love to hear from you!
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <p className="text-center text-muted-foreground">
                                        For any queries or bug reports, please reach out to us at:
                                    </p>
                                    <p className="text-center font-medium mt-2 text-primary select-all">
                                        Official@jeesimplifies.com
                                    </p>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </footer>
    )
}
