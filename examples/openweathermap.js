(function (exports, undefined) {

    var assert = rts.assert;
    var Nil = rts.Nil;
    var Num = rts.Num;
    var Str = rts.Str;
    var Obj = rts.Obj;
    var Subtype = rts.Subtype;
    var Union = rts.Union;
    var Maybe = rts.Maybe;

    // define some helper types
    var Positive = Subtype(Num, function (n) {
        return n >= 0;
    });
    var Temperature = Positive;
    var Percentage = Subtype(Positive, function (n) {
        return n <= 100 && n === parseInt(n, 10); // an integer between 0 and 100
    });
    var Pressure = Num;
    var Datetime = Num;

    // member of WeatherData
    function Main(temp, humidity, temp_min, temp_max, pressure) {
        assert(Temperature.is(temp));
        assert(Percentage.is(humidity));
        assert(Maybe(Temperature).is(temp_min));
        assert(Maybe(Temperature).is(temp_max));
        assert(Pressure.is(pressure));

        this.temp = temp;
        this.humidity = humidity;
        this.temp_min = temp_min;
        this.temp_max = temp_max;
        this.pressure = pressure;
    }

    Main.is = function (x) {
        return x instanceof Main;
    };

    Main.of = function (x) {
        assert(Obj.is(x));
        return new Main(
            Temperature.of(x.temp),
            Percentage.of(x.humidity),
            Maybe(Temperature).of(x.temp_min),
            Maybe(Temperature).of(x.temp_max),
            Pressure.of(x.pressure)
        );
    };

    function WeatherData(dt, name, main) {
        assert(Datetime.is(dt));
        assert(Str.is(name));
        assert(Main.is(main));

        this.dt = dt;
        this.name = name;
        this.main = main;
    }

    WeatherData.is = function (x) {
        return x instanceof WeatherData;
    };

    WeatherData.of = function (x) {
        assert(Obj.is(x));
        return new WeatherData(
            Datetime.of(x.dt),
            Str.of(x.name),
            Main.of(x.main)
        );
    };

    WeatherData.prototype.to_html = function() {

        function to_celsius(t) {
            return Nil.is(t) ? '-' : (t - 273.15).toFixed(2) + ' C°';
        }

        return [
            '<h1>Weather conditions in <em>' + this.name + '</em></h1>',
            '<p>Time of data receiving: ', new Date(this.dt * 1000).toLocaleTimeString(), '</p>',
            '<table>',
                '<tr>',
                    '<td>temp</td><td>', to_celsius(this.main.temp), '</td>',
                '</tr>',
                '<tr>',
                    '<td>humidity</td><td>', this.main.humidity, '%</td>',
                '</tr>',
                '<tr>',
                    '<td>temp_min</td><td>', to_celsius(this.main.temp_min), '</td>',
                '</tr>',
                '<tr>',
                    '<td>temp_max</td><td>', to_celsius(this.main.temp_max), '</td>',
                '</tr>',
                '<tr>',
                    '<td>pressure</td><td>', this.main.pressure, ' hPa</td>',
                '</tr>',
            '</table>'
        ].join('');
    };

    function ApiError(cod, message) {
        assert(Str.is(cod));
        assert(Str.is(message));

        this.cod = cod;
        this.message = message;
    }

    ApiError.is = function (x) {
        return x instanceof ApiError;
    };

    ApiError.of = function (x) {
        assert(Obj.is(x));
        return new ApiError(
            Str.of(x.cod),
            Str.of(x.message)
        );
    };

    ApiError.prototype.to_html = function() {
        return [
            '<h1>Error!</h1>',
            '<table>',
                '<tr>',
                    '<td>cod</td><td>', this.cod, '</td>',
                '</tr>',
                '<tr>',
                    '<td>message</td><td>', this.message, '</td>',
                '</tr>',
            '</table>'
        ].join('');
    };

    // according to the documentation this api may return an error
    var Result = Union(WeatherData, ApiError);

    Result.of = function (x) {
        return Nil.is(x.message) ? WeatherData.of(x) : ApiError.of(x);
    };

    exports.openweathermap = {
        Result: Result
    };

})(typeof exports !== 'undefined' ? exports : window);