export default function calculateTotalPrice(services: string): number {
    const parsedServices = JSON.parse(services);
    const totalPrice = parsedServices.reduce((acc: number, service: any) => acc + service.price, 0);
    return totalPrice;
}