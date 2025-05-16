<!DOCTYPE html>
<html>
<head>
    <title>Music Shop</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h1>Music Shop Inventory</h1>
    <div class="table-responsive">

    <a href="{{route('items.create')}}" class="btn btn-success mb-3">Create Item</a>
        
    @session('success')
        <div class="alert alert-success">{{$value}}</div>
    @endsession
    
        <table
            class="table table-primary"
        >
            <thead>
                <tr>
                    <th scope="col">Column 1</th>
                    <th scope="col">Column 2</th>
                    <th scope="col">Column 3</th>
                </tr>
            </thead>
            <tbody>
                <tr class="">
                    <td scope="row">R1C1</td>
                    <td>R1C2</td>
                    <td>R1C3</td>
                </tr>
                <tr class="">
                    <td scope="row">Item</td>
                    <td>Item</td>
                    <td>Item</td>
                </tr>
            </tbody>
        </table>
    </div>

    </div>
</body>
</html>