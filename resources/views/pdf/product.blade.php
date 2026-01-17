<!DOCTYPE html>
<html>
<head>
    <title>Product Details</title>
    <style>
        body { font-family: sans-serif; }
        .product-header { margin-bottom: 20px; }
        .brand-item { border-bottom: 1px solid #ccc; padding: 10px 0; }
        .total { font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="product-header">
        <h1>{{ $product->name }}</h1>
        <p>{{ $product->description }}</p>
    </div>

    <h2>Brands</h2>
    @foreach($product->brands as $brand)
        <div class="brand-item">
            <h3>{{ $brand->name }}</h3>
            @if($brand->image)
                {{-- Ensure the image path is correct for PDF generation (absolute path usually needed) --}}
                <img src="{{ public_path('storage/'.$brand->image) }}" alt="{{ $brand->name }}" width="100">
            @endif
            <p>{{ $brand->detail }}</p>
            <p>Price: ${{ number_format($brand->price, 2) }}</p>
        </div>
    @endforeach

    <div class="total">
        Total Price: ${{ number_format($totalPrice, 2) }}
    </div>
</body>
</html>
