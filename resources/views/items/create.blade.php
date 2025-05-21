<!DOCTYPE html>
<html>
    <head>
        <title>Music Shop</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="container mt-5">
            <h1>Create Item</h1>
            <div class="table-responsive">
                <a href="{{route('items.index')}}" class="btn btn-primary mb-3">Back</a>
                
                <form method="POST" action="{{route('items.store')}}">
                    @csrf

                    <div class="mt-2">
                        <label for="title">Title:</label>
                        <input type="text" name="title" id="title" class="form-control">
                        @error("title")
                        <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                    <div class="mt-2">
                        <label for="body">Body:</label>
                        <textarea name="body" id="body" class="form-control"></textarea>
                        @error("body")
                        <span class="text-danger">{{ $message }}</span>
                        @enderror
                    </div>

                <div class="mt-2">
                    <button class="btn btn-success">Submit</button>
                </div>
                </form>

        </div>
    </body>
</html>