using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
///Person 的摘要说明
/// </summary>
public class Person
{

    private string _name;
    public string Name
    {
        get { return _name; }
        set { _name = value; }

    }
    /// <summary>
    /// sfs
    /// </summary>
    private int _age;
    public int Age {

        get { return _age; }
        set {

            if (value > 0 && value < 100)
            {
                _age = value;
            }
            else {

                throw new Exception("年龄输入错误");
            }
        
        }
    
    }
	public Person()
	{
		
	}

    public Person(string name, int age)
    {

        this.Name = name;
        this.Age = age;
    }

   
}
