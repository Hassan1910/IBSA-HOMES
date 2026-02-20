"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";

export default function PropertySearch() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [status, setStatus] = useState(searchParams.get("status") || "ALL");
    const [minPrice, setMinPrice] = useState(
        Number(searchParams.get("minPrice")) || 0
    );
    const [maxPrice, setMaxPrice] = useState(
        Number(searchParams.get("maxPrice")) || 10000
    );
    const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "ALL");

    const debouncedSearch = useDebounce(search, 500);
    const debouncedMinPrice = useDebounce(minPrice, 500);
    const debouncedMaxPrice = useDebounce(maxPrice, 500);

    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (status && status !== "ALL") params.set("status", status);
        if (debouncedMinPrice > 0) params.set("minPrice", debouncedMinPrice.toString());
        if (debouncedMaxPrice < 10000)
            params.set("maxPrice", debouncedMaxPrice.toString());
        if (bedrooms && bedrooms !== "ALL") params.set("bedrooms", bedrooms);

        router.push(`/properties?${params.toString()}`);
    }, [
        debouncedSearch,
        status,
        debouncedMinPrice,
        debouncedMaxPrice,
        bedrooms,
        router,
    ]);

    const clearFilters = () => {
        setSearch("");
        setStatus("ALL");
        setMinPrice(0);
        setMaxPrice(10000);
        setBedrooms("ALL");
        router.push("/properties");
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Search Input */}
                <div className="space-y-2">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            id="search"
                            placeholder="Address, Title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Statuses</SelectItem>
                            <SelectItem value="AVAILABLE">Available</SelectItem>
                            <SelectItem value="RENTED">Rented</SelectItem>
                            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Bedrooms Filter */}
                <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Select value={bedrooms} onValueChange={setBedrooms}>
                        <SelectTrigger>
                            <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Any</SelectItem>
                            <SelectItem value="1">1+</SelectItem>
                            <SelectItem value="2">2+</SelectItem>
                            <SelectItem value="3">3+</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label>Price Range</Label>
                        <span className="text-xs text-slate-500">
                            ${minPrice} - ${maxPrice}
                        </span>
                    </div>
                    <Slider
                        defaultValue={[0, 10000]}
                        value={[minPrice, maxPrice]}
                        max={10000}
                        step={100}
                        onValueChange={(value) => {
                            setMinPrice(value[0]);
                            setMaxPrice(value[1]);
                        }}
                        className="py-4"
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={clearFilters} className="text-slate-600">
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                </Button>
            </div>
        </div>
    );
}
