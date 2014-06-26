
function q (string)
{
	return '\'' + string + '\'';
}

function qq (string)
{
	return '"' + string + '"';
}

function qw (string)
{
	return string.split(/\s+/);	
}

function x (token, repeat)
{
	var idx, string = '';
	for (idx = 0; idx < repeat; idx++)
	{
		string += token;
	}
	return string;
}

# string.prototype.x ...
