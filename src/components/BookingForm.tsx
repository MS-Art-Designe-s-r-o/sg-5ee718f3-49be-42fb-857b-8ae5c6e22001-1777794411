import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Navigation, Calendar, Users, Phone, Briefcase, Plane, Mail } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { Dictionary } from "@/locales";

const createBookingSchema = (t: Dictionary) =>
  z.object({
    pickup: z.string().min(3, t.bookingForm.validation.pickup),
    destination: z.string().min(3, t.bookingForm.validation.destination),
    datetime: z.string().min(1, t.bookingForm.validation.datetime),
    phone: z.string().min(10, t.bookingForm.validation.phone),
    email: z.string().email(t.bookingForm.validation.email),
    passengers: z.string().optional(),
    luggage: z.string().optional(),
    flightNumber: z.string().optional(),
    note: z.string().optional(),
    priceEstimateOnly: z.boolean().default(false),
  }).superRefine((data, ctx) => {
    // Objednávku (nie cenovú kalkuláciu) je možné poslať najskôr 6 hodín vopred.
    if (data.priceEstimateOnly || !data.datetime) return;
    const when = new Date(data.datetime).getTime();
    const MIN_ADVANCE_MS = 6 * 60 * 60 * 1000;
    if (Number.isNaN(when) || when - Date.now() < MIN_ADVANCE_MS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["datetime"],
        message: t.bookingForm.validation.datetimeTooSoon,
      });
    }
  });

type BookingFormData = z.infer<ReturnType<typeof createBookingSchema>>;

function passengerUnit(n: number, t: Dictionary, locale: string) {
  if (n === 1) return t.bookingForm.personOne;
  if (locale === "sk" && n < 5) return t.bookingForm.personFew;
  return locale === "sk" ? t.bookingForm.personMany : t.bookingForm.personFew;
}

export function BookingForm() {
  const { t, locale } = useTranslation();
  const bookingSchema = useMemo(() => createBookingSchema(t), [t]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      priceEstimateOnly: false,
    },
  });

  const passengers = watch("passengers");
  const priceEstimateOnly = watch("priceEstimateOnly");

  const onSubmit = async (data: BookingFormData) => {
    try {
      const response = await fetch("/api/send-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, locale }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(t.bookingForm.alerts.success);
        reset();
      } else {
        alert(`⚠️ ${result.message || t.bookingForm.alerts.errorFallback}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(t.bookingForm.alerts.networkError);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-card border border-border rounded-lg p-6 shadow-xl"
    >
      <h2 className="font-display font-bold text-2xl mb-6">
        {t.bookingForm.heading}
      </h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="pickup" className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            {t.bookingForm.from} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="pickup"
            {...register("pickup")}
            placeholder={t.bookingForm.fromPlaceholder}
            className="h-12 text-base"
          />
          {errors.pickup && (
            <p className="text-sm text-destructive mt-1">
              {errors.pickup.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="destination" className="flex items-center gap-2 mb-2">
            <Navigation className="w-4 h-4 text-primary" />
            {t.bookingForm.to} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="destination"
            {...register("destination")}
            placeholder={t.bookingForm.toPlaceholder}
            className="h-12 text-base"
          />
          {errors.destination && (
            <p className="text-sm text-destructive mt-1">
              {errors.destination.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="datetime" className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-primary" />
            {t.bookingForm.when} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="datetime"
            type="datetime-local"
            {...register("datetime")}
            className="h-12 text-base"
          />
          {errors.datetime && (
            <p className="text-sm text-destructive mt-1">
              {errors.datetime.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
            <Phone className="w-4 h-4 text-primary" />
            {t.bookingForm.phone} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            {...register("phone")}
            placeholder={t.bookingForm.phonePlaceholder}
            className="h-12 text-base"
          />
          {errors.phone && (
            <p className="text-sm text-destructive mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-primary" />
            {t.bookingForm.email} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder={t.bookingForm.emailPlaceholder}
            className="h-12 text-base"
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="passengers" className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-primary" />
              {t.bookingForm.passengers}
            </Label>
            <Select
              value={passengers}
              onValueChange={(value) => setValue("passengers", value)}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder={t.bookingForm.select} />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {passengerUnit(num, t, locale)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="luggage" className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-primary" />
              {t.bookingForm.luggage}
            </Label>
            <Input
              id="luggage"
              {...register("luggage")}
              placeholder={t.bookingForm.luggagePlaceholder}
              className="h-12 text-base"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="flightNumber" className="flex items-center gap-2 mb-2">
            <Plane className="w-4 h-4 text-primary" />
            {t.bookingForm.flightNumber}
          </Label>
          <Input
            id="flightNumber"
            {...register("flightNumber")}
            placeholder={t.bookingForm.flightPlaceholder}
            className="h-12 text-base"
          />
        </div>

        <div>
          <Label htmlFor="note" className="mb-2 block">
            {t.bookingForm.note}
          </Label>
          <Textarea
            id="note"
            {...register("note")}
            placeholder={t.bookingForm.notePlaceholder}
            className="min-h-[80px] text-base resize-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="priceEstimateOnly"
            checked={priceEstimateOnly}
            onCheckedChange={(checked) =>
              setValue("priceEstimateOnly", checked as boolean)
            }
          />
          <label
            htmlFor="priceEstimateOnly"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t.bookingForm.estimateOnly}
          </label>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Button
          type="submit"
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-semibold h-14"
        >
          {priceEstimateOnly ? t.bookingForm.submitQuote : t.bookingForm.submitOrder}
        </Button>
        <a href={t.common.phoneHref} className="w-full">
          <Button
            type="button"
            size="lg"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold h-14"
          >
            <Phone className="w-5 h-5 mr-2" />
            {t.common.call}
          </Button>
        </a>
      </div>
    </form>
  );
}
