let codeExamples = {
  to10: [{
      language: "Python",
      content: `
        digits = '0123456789abcdefghijklmnopqrstuvwxyz'
        
        def convert_toBase10(_number, _base):
            if _base > len(digits): return None
            result = 0
            for i in range(0, len(_number)):
                result += digits.index(_number[-1-i]) * pow(_base, i)
            return result
        
        number = input("Число в N-ой системе:")
        base = int(input("Основание этой системы:"))
        
        result = convert_toBase10(str(number), base)
        print("Результат: " + str(result))        
        `
    },
    {
      language: "PascalABC.net",
      content: `
        const digits:string[36] = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var input:string;
        var base:integer;
        
        function convert_toBase10(number:string; base:integer) : integer;
        var res, i, c: integer;
        begin
          res := 0; // Результат
          for i := 0 to length(number)-1 do // Для каждой цифры исходной записи
          begin
            c := pos(number[length(number) - i], digits) - 1;
            res := res + (c * round(base ** i));
          end;
          convert_toBase10 := res;
        end;
        
        begin
          print('Число в десятичной системе:');
          readln(input);
          print('Основание нужной системы:');
          readln(base);
          println(convert_toBase10(input, base));
        end.`
    }
  ],
  toN: [{
      language: "Python",
      content: `
        digits = '0123456789abcdefghijklmnopqrstuvwxyz'
        
        def convert_toBaseN(_number, _base):
            if _base > len(digits): return None
            result = ''
            while _number > 0:
                result = digits[_number % _base] + result
                _number //= _base
            return result
        
        number = int(input("Число в десятичной системе:"))
        base = int(input("Основание нужной системы:"))
        
        result = convert_toBaseN(number, base)
        print("Результат: " + result)
        print("------------------")
        print("Двоичная: 75 -> " + bin(75)[2::])
        print("Восьмеричная: 135 -> " + oct(135)[2::])
        print("Шестнадцатеричная: 620 -> " + hex(620)[2::])
        `
    },
    {
      language: "PascalABC.net",
      content: `
        const digits:string[36] = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var input:string;
        var base:integer;

        function convert_toBaseN(number:integer; base:integer) : string;
        var i, c: integer;
        var res: string;
        begin
        res := ''; // Результат
        while (number > 0) do
        begin
        res := digits[(number mod base) + 1] + res; // Получить цифру и добавить её в начало строки
        number := number div base; // Уменьшить число
        end;
        convert_toBaseN := res;
        end;

        begin
        print('Число в десятичной системе:');
        readln(input);
        print('Основание нужной системы:');
        readln(base);
        println(convert_toBaseN(integer.Parse(input), base));
        end.`,
    }
  ]
};